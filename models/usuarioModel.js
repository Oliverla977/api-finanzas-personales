class Usuario {
    constructor(data) {
        this.id = data.idUsuario;
        this.username = data.username;
        this.correo = data.correo;
        this.moneda = {
            id: data.moneda_id,
            codigo: data.moneda_codigo,
            simbolo: data.moneda_simbolo,
            nombre: data.moneda_nombre
        };
        this.zonaHoraria = {
            id: data.zona_id,
            codigo: data.zona_codigo,
            nombre: data.zona_nombre,
            offset: data.offset
        };
    }

    static async obtenerPorId(id, connection) {
        const [results] = await connection.query(
            `SELECT 
               A.idUsuario,
                A.nombre_usuario AS username,
                A.correo,
                A.moneda_id,
                B.codigoISO AS moneda_codigo,
                B.simbolo AS moneda_simbolo,
                B.nombre AS moneda_nombre,
                A.zona_horaria AS zona_id,
                C.codigo AS zona_codigo,
                C.nombre AS zona_nombre,
                C.offset
            FROM usuarios A 
            INNER JOIN monedas B ON A.moneda_id = B.idMoneda 
            INNER JOIN zonas_horarias C ON A.zona_horaria = C.idZonaHoraria 
            WHERE idUsuario = ?`,
            [id]
        );

        if (!results.length) return null;
        return new Usuario(results[0]);
    }
}

module.exports = Usuario;