
# To-Do List Application

A full-featured To-Do List application built using **React**, **TypeScript**, **React Router**, **Redux Toolkit**, and **TailwindCSS**. This app allows users to manage multiple to-do lists with tasks, supporting sorting, searching, dark/light modes, and more.

## Demo

You can view the live application [here](https://to-do-list-gamma-liard-48.vercel.app).

## Features

### Core Features:
- **User Authentication:** Users can sign in using an email and password (based on your users.json).
- **To-Do List Management:** Users can create, edit, delete, and view multiple to-do lists.
- **Task Management:** Tasks within each to-do list can be added, edited, completed, and deleted.
- **Sort and Search:** Users can search and sort their to-do lists by:
  - Enter its name
  - Alphabetical order (ascending/descending)
  - Most recent/oldest date
- **Night/Light Mode:** Toggle between night and light modes.
- **SessionStorage for User Email:** The user's email is saved in `sessionStorage` for session persistence (not in `localStorage`).
- **Task Deselection with Escape:** Tasks can be deselected using the **Escape** key.

### Bonus Features:
- **Responsive Design:** The application is fully responsive with a user-friendly interface.
- **Search Functionality:** Users can search for specific to-do lists on the home page.
- **Date Display:** Each to-do list shows the creation date.
- **Drag-and-Drop Task Reordering:** Users can reorder tasks using the `hello-pangea` library.
- **"Not Found" Page:** A custom page appears when navigating to an invalid route.

## Technologies Used

- **Frontend:**
  - **React.js** with **TypeScript**
  - **React Router DOM** for routing
  - **Redux Toolkit** and **React Redux** for state management
  - **TailwindCSS** and **DaisyUI** for styling
  - **react-icons** for icons
  - **hello-pangea** for drag-and-drop functionality
- **Deployment:**
  - Hosted on **Vercel**

## Installation

### Clone the repository

```bash
git clone https://github.com/Kareem-Nasrallah/to-do_list.git
```

### Navigate to the project folder

```bash
cd to-do_list
```

### Install dependencies

```bash
npm install react-router-dom react-icons react-redux @reduxjs/toolkit tailwindcss daisyui @hello-pangea/dnd
```

### Run the project locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Application Structure

Here is a basic overview of the folder structure:

```
/src
  /components        # Reusable components like ListWindow, Header, etc.
  /redux          # Redux slices (e.g., themeSlice, userSlice, etc.)
  /pages             # Page components like Home, ToDoList, etc.
  App.tsx            # Main application component
  index.tsx          # Application entry point
```

### File Descriptions

- **`src/redux`**: Contains Redux slice files for managing application state, such as `themeSlice.ts` and `userSlice.ts`.
- **`src/components`**: Contains reusable components like `ListWindow.tsx`, `Header.tsx`, etc.
- **`src/pages`**: Contains different page components like `Home.tsx`, `TodoList.tsx`, etc.
- **`App.tsx`**: The root component where routing and state management are integrated.

## User Authentication

The application allows the user to log in with an email and password. For this version, user data is stored in the frontend.

### Login
- The login form accepts an email and password.
- Upon successful authentication, the user is redirected to the Home page.
- If the user has selected "Remember Me", their credentials are saved for future sessions.

### Logout
- The user can log out by clicking the profile badge on the Home page.

## Dark/Light Mode

Users can toggle between dark and light themes. The application stores the theme preference in `localStorage` and applies the theme accordingly.

## Sorting and Searching To-Do Lists

The home page allows users to:
- **Sort to-do lists** alphabetically, by creation date (most recent or oldest).
- **Search for a to-do list** by name.

## Task Management Features

On the to-do list detail page, users can:
- **Add a new task**
- **Edit an existing task**
- **Mark tasks as completed**
- **Delete tasks**

### Bonus Features:
- **Drag-and-drop** functionality to reorder tasks using the `hello-pangea` library.
- **Keyboard shortcuts**:
  - `Ctrl/Cmd + N` to add a task
  - Arrow Up/Down to navigate tasks
  - Space to mark task as complete
  - `E` or `Enter` to edit the selected task
  - `Delete` to delete a task

## Deployment

The application is hosted on Vercel. You can access the live app [here](https://to-do-list-gamma-liard-48.vercel.app).

## Known Issues

- No backend implemented for user authentication (currently using `sessionStorage` and `localStorage` for demonstration).

## Future Improvements

- Add more advanced task features like due dates, categories, and labels.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgements

- **React** and **Redux Toolkit** for state management.
- **TailwindCSS** for styling.
- **daisyUI** for the UI components.
- **hello-pangea** for drag-and-drop functionality.

## Contact

For any questions or feedback, feel free to reach out to me at [kareemnasrallah88@example.com](mailto:kareemnasrallah88@example.com).
