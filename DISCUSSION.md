## Step 1: Fixing Bugs

### 1.1 Typescript Errors
- **Add Types:** Defined a TypeScript interface for the `Advocate` object to ensure type safety throughout the component.
- **Type State Variables:** Update the state hooks to use the `Advocate[]` type instead of the default `any[]`.
- **Type Event Handlers:** Specify types for event handler parameters, such as `React.ChangeEvent<HTMLInputElement>` for input changes.

### 1.2 Null References
- **Safe Access:** Ensure that all properties accessed on `advocate` objects exist and are not `null` or `undefined`. Use optional chaining or default values where necessary.
- **Specialties Array:** When mapping over `advocate.specialties`, ensure it is always an array (e.g., `advocate.specialties ?? []`).

### 1.3 Incorrect Search Logic
- **Case Insensitivity:** Update the search logic to perform case-insensitive matching for better user experience.
- **Array Fields:** For fields like `specialties`, check if any specialty matches the search term, rather than using `.includes` directly on the array.
- **Years of Experience:** Convert numbers to strings before searching.

### 1.4 Missing Key Props
- **Add Key Props:** When rendering lists (e.g., `filteredAdvocates.map` and `advocate.specialties.map`), add a unique `key` prop to each child element to prevent React warnings and improve rendering performance.

### 1.5 **<th>** in <thead>
- **Ensure Valid HTML Structure:** When rendering with `<thead>` we need to include a table row tag, otherwise we get hydration errors from Next.

---

## Step 2: Addressing Anti-Patterns

### 2.1 Direct DOM Manipulation
- **Remove `document.getElementById`:** Replaced with a `useState` to keep track of the search term. 

### 2.2 Inline Styles
- **Replace Inline Styles:** Moved inline styles to CSS classes and use the `className` prop instead of `style`.

### 2.3 Unsafe String Operations
- **Sanitize Inputs:** Ensure that user input is handled safely and consistently, especially when displaying or searching.

### 2.4 Poor Error Handling
- **Add Error State:** Introduce an error state to handle fetch failures and display appropriate messages to the user.

### 2.5 Missing Loading States
- **Add Loading State:** Introduce a loading state to indicate when data is being fetched.

### 2.6 Inefficient Re-renders
- **Optimize Filtering:** Use `useMemo` to memoize filtered results based on dependencies, reducing unnecessary re-renders.

### 2.7 Hard-coded Element IDs
- **Remove Hard-coded IDs:** Eliminate hard-coded element IDs in favor of React state and props for dynamic updates.

---

## Step 3: Improving Code Quality

### 3.1 Typing
- **Missing TypeScript Types:** Added `Advocate` type to be used with the function args.

### 3.2 Console logs
- **Remove Console log:** Useful for development, these are not needed for production use.

### 3.3 Accessibility Improvements
- **Semantic HTML:** Use semantic HTML elements and attributes (e.g., `<label htmlFor="search-input">`) to improve accessibility.
- **Keyboard Navigation:** Ensure interactive elements are accessible via keyboard.

### 3.4 File Organization
- **Organize Files:** Place components, types, and utility functions in separate files or folders as the project grows to maintain a clean structure.
- **Bite-sized Chunks:** Strip down large `page.tsx` file into smaller more managable components.

---

## Component Improvements
### Summary of Changes

This change focuses on improving the search and filtering experience for advocates, as well as enhancing code quality and maintainability. The main changes include:

- **Enhanced Search Bar:** The search bar now supports real-time search, quick search suggestions, and improved accessibility.
- **No Results State:** Added a user-friendly "No Results" component with actionable suggestions and popular searches to guide users when no advocates match their criteria.
- **Filter Panel Improvements:** Advanced filters for specialty, location, and years of experience are now more intuitive and visually organized.
- **Advocate Card Updates:** Advocate cards now highlight search terms, display specialties more clearly, and improve the presentation of contact information.
- **UI/UX Polish:** Consistent use of Tailwind CSS classes, semantic HTML, and responsive layouts for a modern, accessible interface.

Overall, these changes make the advocate search experience more robust, user-friendly, and maintainable for future development.

---
