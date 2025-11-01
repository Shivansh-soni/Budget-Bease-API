# Budget Beast - Codebase Overview

## 1. Purpose
Budget Beast is a comprehensive personal and group finance management application. It helps users track their income and expenses, manage budgets, split expenses with others, and monitor their financial health. The application supports both individual financial management and group expense tracking with features for settling up balances between users.

## 2. Directory Structure

```
budget-beast/
├── src/
│   ├── app/                 # Core application module
│   ├── features/            # Feature modules
│   │   ├── Finance/         # Personal finance management
│   │   ├── auth/            # Authentication and authorization
│   │   ├── splitting/       # Expense splitting functionality
│   │   └── users/           # User management
│   ├── prisma/              # Database schema and migrations
│   └── utils/               # Utility functions and helpers
├── test/                    # Test files
├── .env                     # Environment variables
├── docker-compose.yml       # Docker configuration
├── Dockerfile               # Docker build configuration
└── package.json             # Project dependencies and scripts
```

## 3. Architecture

### 3.1 Technical Stack
- **Backend Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful architecture
- **Containerization**: Docker
- **Testing**: Jest
- **Linting/Formatting**: ESLint, Prettier

### 3.2 Architecture Pattern
- **Modular Architecture**: The application follows NestJS's module-based architecture
- **Layered Architecture**:
  - Controllers: Handle HTTP requests and responses
  - Services: Contain business logic
  - Repositories: Handle data access (abstracted by Prisma)
  - DTOs: Data Transfer Objects for request/response validation

## 4. Core Features

### 4.1 User Management
- User registration and authentication
- Role-based access control (Admin/User)
- User profile management

### 4.2 Personal Finance
- Income and expense tracking
- Categorization of transactions
- Budget management by categories
- Savings tracking
- Receipt management with image uploads

### 4.3 Group Expenses
- Group creation and management
- Expense sharing among group members
- Balance tracking between users
- Split calculations
- Expense history and settlements

## 5. Data Model

### Key Entities:
- **Users**: Core user information and authentication
- **Categories**: For organizing transactions (income/expense)
- **Groups**: For managing shared expenses
- **Transactions**: Personal financial records
- **Group Expenses**: Shared expenses within groups
- **Expense Splits**: How expenses are divided among group members
- **Group Balances**: Tracks who owes what to whom

## 6. Configuration

### Environment Variables
Required environment variables (stored in `.env`):
- `PORT`: Application port (default: 5001)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time

### Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up database:
   ```bash
   npx prisma migrate dev
   ```
3. Start development server:
   ```bash
   npm run start:dev
   ```

## 7. API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get current user profile

### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Categories
- `GET /categories` - Get all categories for user
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Transactions
- `GET /transactions` - Get all transactions
- `POST /transactions` - Create new transaction
- `GET /transactions/:id` - Get transaction by ID
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Groups
- `GET /groups` - Get all groups for user
- `POST /groups` - Create new group
- `GET /groups/:id` - Get group details
- `POST /groups/:id/members` - Add member to group
- `DELETE /groups/:id/members/:userId` - Remove member from group

### Group Expenses
- `POST /groups/:groupId/expenses` - Create group expense
- `GET /groups/:groupId/expenses` - Get group expenses
- `GET /groups/:groupId/balances` - Get group balances
- `POST /groups/:groupId/settle` - Settle up between members

## 8. Development Workflow

### Code Style
- Follows NestJS best practices
- Uses TypeScript strict mode
- ESLint and Prettier for code formatting
- JSDoc documentation for all functions

### Testing
- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`
- Test coverage: `npm run test:cov`

### Database Migrations
1. Make changes to `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name your_migration_name`
3. Apply migration: `npx prisma migrate deploy` (in production)

## 9. Deployment

### Docker
```bash
docker-compose up --build
```

### Production
1. Build the application: `npm run build`
2. Start in production: `npm run start:prod`

## 10. Future Improvements

### Planned Features
- Recurring transactions
- Financial reports and analytics
- Mobile app integration
- Multi-currency support
- Automated bank transaction imports
- Enhanced receipt OCR processing

### Technical Debt
- Add more comprehensive test coverage
- Implement rate limiting
- Add API documentation (Swagger/OpenAPI)
- Implement proper logging and monitoring
- Add input validation and sanitization
- Implement proper error handling middleware

## 11. Security Considerations
- Password hashing with bcrypt
- JWT for authentication
- Input validation and sanitization
- Role-based access control
- Secure database queries through Prisma

## 12. Dependencies

### Main Dependencies
- `@nestjs/*`: Core NestJS framework modules
- `@prisma/client`: Database ORM
- `bcrypt`: Password hashing
- `jsonwebtoken`: Authentication
- `class-validator`: Request validation
- `class-transformer`: Object transformation

### Development Dependencies
- `@nestjs/cli`: NestJS command line tools
- `prisma`: Database migration and management
- `jest`: Testing framework
- `eslint`: Linting
- `prettier`: Code formatting
- `typescript`: TypeScript support

## 13. Troubleshooting

### Common Issues
1. **Database connection issues**: Verify `DATABASE_URL` in `.env`
2. **Migration problems**: Try resetting the database with `npx prisma migrate reset`
3. **Dependency issues**: Delete `node_modules` and `package-lock.json`, then run `npm install`

### Getting Help
- Check the NestJS documentation: https://docs.nestjs.com/
- Prisma documentation: https://www.prisma.io/docs/
- Open an issue in the repository for bugs and feature requests
