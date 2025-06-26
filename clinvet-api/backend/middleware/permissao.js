export function permitirAcesso(cargosPermitidos) {
  return (req, res, next) => {
    
    if (!req.usuario || !cargosPermitidos.includes(req.usuario.cargo)) {
      return res.status(403).json({ mensagem: 'Acesso negado: permissão insuficiente.' });
    }
    next();
  };
}
