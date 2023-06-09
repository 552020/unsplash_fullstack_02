# unsplash_fullstack_02

Just another fullstack blog. Featurig Next.js, Node.js/Express, Prisma, PostgreSQL starting from this template: https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-express

## Technologies and Services

- Nodejs
- Express
- JavaScript
- Typescript
- React
- Next.js
- Tailwind
- Prisma
- PostgreSQL
- Git
- GitHub
- Vercel
- Digital Ocean
- Railway

## Useful links, notes & stuff

### Deploying a backend on the fly after Heroku

- Where to deploy the nodejs/express backend. Some suggestions by Theo: https://www.youtube.com/watch?v=prjMJtXCR-g&ab_channel=Theo-t3%E2%80%A4gg

|               |             Easy              |               Medium               |  Hard   |
| :-----------: | :---------------------------: | :--------------------------------: | :-----: |
| Docker Image  |          Railway.app          |         Render.com, Fly.io         |   AWS   |
| Website Host  | Vercel, Netlify, Github Pages |       Render.com, Cloudflare       | AWS/GCP |
| Database Host |            Railway            | Planetscale, Supabase, CockroachDB | AWS/GCP |

I took Digital Ocean. Not listed here, but I used Railway to host the PostgreSQL database.

### Where to host a database online

https://www.prisma.io/dataguide/mysql/5-ways-to-host-mysql

### Authentication

- JWT secret key generation https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it

### Styling

- How to add Tailwind to a Nextjs project. Besides follwoing the instructions on the Tailwind website, create a global.css file at the root of your project and add `impoert '../styles/global.css` to the \_app.tsx file and create one it this doens't exits

## Notes

### How not to store the JWT token in the local storage

If you decide not to store JWTs in local storage due to the risk of XSS attacks, and you also decide against using HttpOnly cookies (for example, because you want to be able to read the token on the client side), then an in-memory strategy can be used as a more secure alternative. This strategy involves storing the token in a variable in your application's memory. However, this means the token will be lost if the user refreshes the page or closes the tab or browser, so you'll need to have a strategy to handle that, such as prompting the user to log in again. Keep in mind that no strategy is 100% secure, and each has its own trade-offs.

### How to savely store a password

https://codahale.com/how-to-safely-store-a-password/

### Type assertion

// Type assertion is being used in this case to assert that the decoded object has a certain shape, specifically that it has an id property which is a number. This is because JWT decoding in JavaScript is a bit loose and does not provide strict typing. It's not 100% safe because we're basically telling TypeScript "trust me, I know what I'm doing". If the decoded token does not actually have an id property that is a number, it could lead to unexpected behavior. To mitigate this risk, you could add a runtime check to ensure that decoded.id is indeed a number before assigning it to req.userId.

### Runtime check in verifyToken

// In the verifyToken function, consider adding a runtime check to ensure that decoded.id is indeed a number before assigning it to req.userId. This can help prevent unexpected behavior if the decoded token doesn't have the expected structure.

> From here start the offiicial documentation of the template:

## Fullstack Example with Next.js (REST API)

This example shows how to implement a **fullstack app in TypeScript with [Next.js](https://nextjs.org/)** using [React](https://reactjs.org/) (frontend), [Express](https://expressjs.com/) and [Prisma Client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client) (backend). The example uses an SQLite database file with some initial dummy data which you can find at [`./backend/prisma/dev.db`](./backend/prisma/dev.db).

## Getting Started

### 1. Download example and install dependencies

Download this example:

```
npx try-prisma@latest --template typescript/rest-nextjs-express
```

Navigate to the example:

```
cd rest-nextjs-express
```

<details><summary><strong>Alternative:</strong> Clone the entire repo</summary>

Clone this repository:

```
git clone git@github.com:prisma/prisma-examples.git --depth=1
```

Navigate to the example:

```
cd prisma-examples/typescript/rest-nextjs-express
```

</details>

#### Install npm dependencies:

Install dependencies for your [`backend`](./backend). Open a terminal window and install the `backend`'s dependencies

```bash
cd backend
npm install
```

Open a separate terminal window and navigate to your [`frontend`](./frontend) directory and install its dependencies

```bash
cd frontend
npm install
```

### 2. Create and seed the database (backend)

On the terminal window used to install the backend npm dependencies, run the following command to create your SQLite database file. This also creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./backend/prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./backend/prisma/seed.ts) will be executed and your database will be populated with the sample data.

### 3. Start the server (backend)

On the same terminal used in step 2, run the following command to start the server:

```bash
npm run dev
```

The server is now running at [`http://localhost:3001/`](http://localhost:3001/).

### 4. Start the app (frontend)

On the terminal window used to install frontend npm dependencies, run the following command to start the app:

```bash
npm run dev
```

The app is now running, navigate to [`http://localhost:3000/`](http://localhost:3000/) in your browser to explore its UI.

<details><summary>Expand for a tour through the UI of the app</summary>

<br />

**Blog** (located in [`./pages/index.tsx`](./pages/index.tsx))

![](https://imgur.com/eepbOUO.png)

**Signup** (located in [`./pages/signup.tsx`](./pages/signup.tsx))

![](https://imgur.com/iE6OaBI.png)

**Create post (draft)** (located in [`./pages/create.tsx`](./pages/create.tsx))

![](https://imgur.com/olCWRNv.png)

**Drafts** (located in [`./pages/drafts.tsx`](./pages/drafts.tsx))

![](https://imgur.com/PSMzhcd.png)

**View post** (located in [`./pages/posts/[id].tsx`](./pages/posts/[id].tsx)) (delete or publish here)

![](https://imgur.com/zS1B11O.png)

</details>

## Using the REST API

You can also access the REST API of the API server directly. It is running [`localhost:3001`](http://localhost:3001) (so you can e.g. reach the API with [`localhost:3000/feed`](http://localhost:3001/feed)).

### `GET`

- `/api/post/:id`: Fetch a single post by its `id`
- `/api/feed`: Fetch all _published_ posts
- `/api/filterPosts?searchString={searchString}`: Filter posts by `title` or `content`

### `POST`

- `/api/post`: Create a new post
  - Body:
    - `title: String` (required): The title of the post
    - `content: String` (optional): The content of the post
    - `authorEmail: String` (required): The email of the user that creates the post
- `/api/user`: Create a new user
  - Body:
    - `email: String` (required): The email address of the user
    - `name: String` (optional): The name of the user

### `PUT`

- `/api/publish/:id`: Publish a post by its `id`

### `DELETE`

- `/api/post/:id`: Delete a post by its `id`

## Evolving the app

Evolving the application typically requires three steps:

1. Migrate your database using Prisma Migrate
1. Update your server-side application code
1. Build new UI features in React

For the following example scenario, assume you want to add a "profile" feature to the app where users can create a profile and write a short bio about themselves.

### 1. Migrate your database using Prisma Migrate

The first step is to add a new table, e.g. called `Profile`, to the database. You can do this by adding a new model to your [Prisma schema file](./prisma/schema.prisma) file and then running a migration afterwards:

```diff
// schema.prisma

model Post {
  id        Int     @default(autoincrement()) @id
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int
}

model User {
  id      Int      @default(autoincrement()) @id
  name    String?
  email   String   @unique
  posts   Post[]
+ profile Profile?
}

+model Profile {
+  id     Int     @default(autoincrement()) @id
+  bio    String?
+  userId Int     @unique
+  user   User    @relation(fields: [userId], references: [id])
+}
```

Once you've updated your data model, you can execute the changes against your database with the following command:

```
npx prisma migrate dev
```

### 2. Update your application code

You can now use your `PrismaClient` instance to perform operations against the new `Profile` table. Here are some examples:

#### Create a new profile for an existing user

```ts
const profile = await prisma.profile.create({
  data: {
    bio: "Hello World",
    user: {
      connect: { email: "alice@prisma.io" },
    },
  },
});
```

#### Create a new user with a new profile

```ts
const user = await prisma.user.create({
  data: {
    email: "john@prisma.io",
    name: "John",
    profile: {
      create: {
        bio: "Hello World",
      },
    },
  },
});
```

#### Update the profile of an existing user

```ts
const userWithUpdatedProfile = await prisma.user.update({
  where: { email: "alice@prisma.io" },
  data: {
    profile: {
      update: {
        bio: "Hello Friends",
      },
    },
  },
});
```

### 3. Build new UI features in React

Once you have added a new endpoint to the API (e.g. `/api/profile` with `/POST`, `/PUT` and `GET` operations), you can start building a new UI component in React. It could e.g. be called `profile.tsx` and would be located in the `pages` directory.

In the application code, you can access the new endpoint via `fetch` operations and populate the UI with the data you receive from the API calls.

## Switch to another database (e.g. PostgreSQL, MySQL, SQL Server, MongoDB)

If you want to try this example with another database than SQLite, you can adjust the the database connection in [`prisma/schema.prisma`](./prisma/schema.prisma) by reconfiguring the `datasource` block.

Learn more about the different connection configurations in the [docs](https://www.prisma.io/docs/reference/database-reference/connection-urls).

<details><summary>Expand for an overview of example configurations with different databases</summary>

### PostgreSQL

For PostgreSQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
}
```

Here is an example connection string with a local PostgreSQL database:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://janedoe:mypassword@localhost:5432/notesapi?schema=public"
}
```

### MySQL

For MySQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://USER:PASSWORD@HOST:PORT/DATABASE"
}
```

Here is an example connection string with a local MySQL database:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://janedoe:mypassword@localhost:3306/notesapi"
}
```

### Microsoft SQL Server

Here is an example connection string with a local Microsoft SQL Server database:

```prisma
datasource db {
  provider = "sqlserver"
  url      = "sqlserver://localhost:1433;initial catalog=sample;user=sa;password=mypassword;"
}
```

### MongoDB

Here is an example connection string with a local MongoDB database:

```prisma
datasource db {
  provider = "mongodb"
  url      = "mongodb://USERNAME:PASSWORD@HOST/DATABASE?authSource=admin&retryWrites=true&w=majority"
}
```

</details>

## Next steps

- Check out the [Prisma docs](https://www.prisma.io/docs)
- Share your feedback in the [`#product-wishlist`](https://prisma.slack.com/messages/CKQTGR6T0/) channel on the [Prisma Slack](https://slack.prisma.io/)
- Create issues and ask questions on [GitHub](https://github.com/prisma/prisma/)
- Watch our biweekly "What's new in Prisma" livestreams on [Youtube](https://www.youtube.com/channel/UCptAHlN1gdwD89tFM3ENb6w)
