import jwt from "jsonwebtoken";

export const userAuth = async (req, reply) => {
  try {
    const token = req.cookies.User_token;

    if (!token) {
      return reply.status(401).send({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded;
  } catch (error) {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }
};
