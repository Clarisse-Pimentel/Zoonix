import jwt from 'jsonwebtoken';
const chaveSecreta = process.env.JWT_SECRET || 'clinvet13579vet45813';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ mensagem: 'Token não enviado' });

  try {
    const payload = jwt.verify(token, chaveSecreta);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
  }
}
