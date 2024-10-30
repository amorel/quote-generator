import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../infrastructure/persistence/models/UserModel";

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  password: string;
}

export default async function (fastify: FastifyInstance) {
  // Login
  fastify.post<{ Body: LoginBody }>(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      // Vérifier si l'utilisateur existe
      const user = await UserModel.findOne({ email });
      if (!user) {
        return reply.code(401).send({ error: "Invalid credentials" });
      }

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return reply.code(401).send({ error: "Invalid credentials" });
      }

      // Générer le token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return { token };
    }
  );

  // Register
  fastify.post<{ Body: RegisterBody }>(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      // Vérifier si l'email existe déjà
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return reply.code(400).send({ error: "Email already exists" });
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Créer le nouvel utilisateur
      const user = new UserModel({
        email,
        password: hashedPassword,
        role: "user",
      });

      await user.save();

      // Générer le token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return { token };
    }
  );

  // Validate token
  fastify.post("/validate", async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return reply.code(401).send({ valid: false });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return { valid: true, user: decoded };
    } catch (error) {
      return reply.code(401).send({ valid: false });
    }
  });
}
