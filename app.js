import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/authRouter.js';
import blogRouter from './routes/blogRouter.js';
import commentRouter from './routes/commentRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter);
app.use(mongoSanitize());
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//handlers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/blogs', commentRouter);

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Blog REST API',
      description:
        'A REST API built with Express and MongoDB. This API provides movie catchphrases and the context of the catchphrase in the movie.',
    },
  },
  apis: ['./routes/*'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = process.env.PORT || 5001;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(process.env.PORT, () => {
    console.log(`listening on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
