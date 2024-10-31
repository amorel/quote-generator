import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../infrastructure/persistence/models/UserModel";
import { JWT_CONFIG } from "../config/jwt";

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
      try {
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
          JWT_CONFIG.secret,
          { expiresIn: JWT_CONFIG.expiresIn }
        );

        return { token };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
          error: "An error occurred during login",
        });
      }
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

      // Validation supplémentaire du mot de passe
      if (password.length < 8) {
        return reply
          .code(400)
          .send({ error: "Password must be at least 8 characters long" });
      }

      // Vérification basique de la force du mot de passe
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return reply.code(400).send({
          error:
            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
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
      const decoded = jwt.verify(token, JWT_CONFIG.secret);
      return { valid: true, user: decoded };
    } catch (error) {
      return reply.code(401).send({ valid: false });
    }
  });
}
