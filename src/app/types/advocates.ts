export type Advocate = {
    id?: number;
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    specialties: Array<string>;
    yearsOfExperience: number;
    phoneNumber: bigint;
    createdAt: string;
}