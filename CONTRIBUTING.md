# Contributions

I'm really glad, you found your way here. 👋🏽 Contributions are welcomed, 
thank you in advance for improving the project! Credit will always be given!

## How to contribute

1. **Report Issues**: If you find a bug or have a feature request, please open 
an issue [here](https://github.com/JakobKlotz/lhasa-app/issues).
2. **Submit Pull Requests**: Eager to submit code changes? Fork the repository,
create a branch, make your changes, and submit a pull request. Be sure to 
follow the project's coding standards.

> [!NOTE]
> If you're addressing an open issue, consider commenting on the issue to let others know you're working on it.

## Code Changes

Submitting changes? Please follow the instructions below to ensure a 
smooth collaboration process.

### Steps

1. Create a fork of the repository. To do so, click on the fork button on the 
top right of the repository page.
2. Clone your fork locally.
3. Create and checkout a new branch.
4. Apply your changes.
5. Preview your changes locally. Refer to the local development section
below for instructions. 
6. Commit and push your changes.
7. Visit the GitHub page of your fork and create a Pull Request.

### Local development

This project is divided into two parts: the backend and the frontend.
The backend is written in Python, while the frontend is built with JavaScript.
To test the project locally, you need to set up tools for both languages.

#### Backend

Install [`uv`](https://docs.astral.sh/uv/getting-started/installation/).
Navigate to the backend directory and install the required dependencies:

```bash
cd backend
uv sync
```

To spin up the backend, run:

```bash
uv run uvicorn api.index:app --reload
```

Documentation for the API can be found at `localhost:8000/docs`.

##### Frontend

First install [Node.js](https://nodejs.org/en/download). Navigate to the
frontend directory and install the required dependencies:

```bash
cd frontend
npm install
```

Start the frontend with:

```bash
npm run dev
```

The app will be available at `localhost:3000`.

## Conventions

### Commit Messages

Consider prefacing your commit messages with tags. Here's an overview of the 
tags used:

| tag      | description                                                              |
|----------|--------------------------------------------------------------------------|
| fix      | patches a bug                                                            |
| feat     | introduces a new feature                                                 |
| docs     | modifications/additions to the documentation                             |
| refactor | restructuring/rewriting code without changing its original functionality |
| chore    | routine tasks such as expanding the `.gitignore`                         |
| deps     | Any changes or additions to the project's dependencies                   |
| test     | changes or additions to the unit tests                                   |
| style    | stylistic changes to the app                                             |

If you're changes are addressing a particular issue, reference the issue within
your commit message. For example:

```plaintext
git commit -m "docs: described optional usage of GitHub action #3"
```

Issues can be referenced with a `#` and the corresponding issue number.

---

Thank you for improving this project! 🚀

Jakob