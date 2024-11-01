import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../infrastructure/persistence/models/UserModel";
import { JWT_CONFIG } from "../config/jwt";

interface RegisterBody {
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export default async function (fastify: FastifyInstance) {
  // Register route
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
      try {
        const { email, password } = request.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
          return reply.code(400).send({
            error: "Cet email est déjà utilisé",
          });
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
          JWT_CONFIG.secret,
          { expiresIn: JWT_CONFIG.expiresIn }
        );

        // Retourner le token et les informations de l'utilisateur
        return reply.code(201).send({
          token,
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
          error: "Une erreur est survenue lors de l'inscription",
        });
      }
    }
  );

  // Login route
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
      try {
        const { email, password } = request.body;

        // Vérifier si l'utilisateur existe
        const user = await UserModel.findOne({ email });
        if (!user) {
          return reply.code(401).send({
            error: "Email ou mot de passe incorrect",
          });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return reply.code(401).send({
            error: "Email ou mot de passe incorrect",
          });
        }

        // Générer le token
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role,
          },
          JWT_CONFIG.secret,
          { expiresIn: JWT_CONFIG.expiresIn }
        );

        return reply.send({
          token,
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
          error: "Une erreur est survenue lors de la connexion",
        });
      }
    }
  );

  // Validate token route
  fastify.post("/validate", async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return reply.code(401).send({ valid: false });
    }

    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secret);
      return reply.send({ valid: true, user: decoded });
    } catch (error) {
      return reply.code(401).send({ valid: false });
    }
  });
}
