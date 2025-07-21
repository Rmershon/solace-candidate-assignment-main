import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { sql, count, ilike, and, gte, lte, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Filter parameters
    const searchTerm = searchParams.get('search') || '';
    const specialty = searchParams.get('specialty') || '';
    const city = searchParams.get('city') || '';
    const minExperience = searchParams.get('minExperience');
    const maxExperience = searchParams.get('maxExperience');

    // Check if we have a valid database connection
    if (db) {
      try {
        // Database-based filtering with SQL
        const whereConditions = [];
        
        if (searchTerm) {
          whereConditions.push(
            or(
              ilike(advocates.firstName, `%${searchTerm}%`),
              ilike(advocates.lastName, `%${searchTerm}%`),
              ilike(advocates.city, `%${searchTerm}%`),
              ilike(advocates.degree, `%${searchTerm}%`),
              sql`${advocates.yearsOfExperience}::text ILIKE ${`%${searchTerm}%`}`,
              sql`${advocates.specialties}::text ILIKE ${`%${searchTerm}%`}`
            )
          );
        }
        
        if (specialty) {
          whereConditions.push(
            sql`${advocates.specialties}::text ILIKE ${`%${specialty}%`}`
          );
        }
        
        if (city) {
          whereConditions.push(ilike(advocates.city, `%${city}%`));
        }
        
        if (minExperience) {
          whereConditions.push(gte(advocates.yearsOfExperience, parseInt(minExperience)));
        }
        
        if (maxExperience) {
          whereConditions.push(lte(advocates.yearsOfExperience, parseInt(maxExperience)));
        }

        const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

        // Get total count for pagination metadata
        const totalCountResult = whereClause 
          ? await db.select({ count: count() }).from(advocates).where(whereClause)
          : await db.select({ count: count() }).from(advocates);
        
        const total = totalCountResult[0].count;

        // Get paginated and filtered data
        const data = whereClause
          ? await db.select().from(advocates).where(whereClause).limit(limit).offset(offset).orderBy(advocates.id)
          : await db.select().from(advocates).limit(limit).offset(offset).orderBy(advocates.id);

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return Response.json({
          data,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage,
            hasPrevPage
          }
        });

      } catch (dbError) {
        console.warn('Database query failed, falling back to static data:', dbError);
        // Fall through to static data handling
      }
    }

    // Fallback to in-memory filtering with static data
    let filteredData = [...advocateData];

    // Apply search term filter
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      filteredData = filteredData.filter((advocate) => {
        const searchFields = [
          advocate.firstName.toLowerCase(),
          advocate.lastName.toLowerCase(),
          advocate.city.toLowerCase(),
          advocate.degree.toLowerCase(),
          advocate.yearsOfExperience.toString(),
          ...advocate.specialties.map(s => s.toLowerCase())
        ];
        
        return searchFields.some(field => field.includes(normalizedSearchTerm));
      });
    }

    // Apply specialty filter
    if (specialty) {
      filteredData = filteredData.filter(advocate => 
        advocate.specialties.some(s => 
          s.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    // Apply city filter
    if (city) {
      filteredData = filteredData.filter(advocate => 
        advocate.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Apply experience filter
    if (minExperience) {
      filteredData = filteredData.filter(advocate => 
        advocate.yearsOfExperience >= parseInt(minExperience)
      );
    }

    if (maxExperience) {
      filteredData = filteredData.filter(advocate => 
        advocate.yearsOfExperience <= parseInt(maxExperience)
      );
    }

    const total = filteredData.length;

    // Apply pagination to the filtered data
    const data = filteredData.slice(offset, offset + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return Response.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Error fetching advocates:', error);
    return Response.json(
      { error: 'Failed to fetch advocates' },
      { status: 500 }
    );
  }
}
