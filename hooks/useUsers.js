import { useCallback } from "react";
import { stringsMatch } from "../utils/functions.es6";

function useUsers () {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");

  const fetchUsuarios = useCallback(async () => {
    const resGet = await axios.get(`/api/users`).catch((err) => err);
    if (resGet instanceof Error) {
      alert(resGet.message);
      setUsuarios([]);
      return;
    }
    setUsuarios(resGet.data);
  }, []);
  
  /** Función para filtrar los planes de estudios. */
  const filtrarUsuarios = useCallback(() => {
    if (filtro === "") {
      return usuarios;
    }
    return usuarios.filter(
      (u) =>
        stringsMatch(`${u.nombre} ${u.apellido}`, filtro) ||
        stringsMatch(u.matricula, filtro)
    );
  }, [filtro, usuarios]);

  const handleSetFiltro = useCallback(filtro => {
    setFiltro(filtro);
  }, []);

  const usuariosFiltrados = filtrarUsuarios();

  return { usuarios: usuariosFiltrados, filtro, fetchUsuarios, setAdmin, filtrarUsuarios, handleSetFiltro };
}

export default useUsers;
