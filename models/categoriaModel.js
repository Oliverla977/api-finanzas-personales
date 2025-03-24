class Categoria {
    constructor(data) {
        this.id = data.idCategoria;
        this.usuario_id = data.usuario_id;
        this.nombre = data.nombre;
        this.tipo = data.tipo;
    }

    static async obtenerPorId(id, connection) {
        const [results] = await connection.query(
            `SELECT 
                B.idCategoria,
                A.idUsuario,
                A.nombre_usuario AS username,
                B.nombre,
                B.tipo
            FROM usuarios A 
            INNER JOIN categorias B ON A.idUsuario = B.usuario_id
            WHERE A.idUsuario = ?`,
            [id]
        );

        if (!results.length) return null;
        return new Categoria(results[0]);
    }
}

module.exports = Categoria;