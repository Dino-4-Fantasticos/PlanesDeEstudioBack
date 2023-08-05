import { useCallback, useState } from "react";
import { stringsMatch } from "../utils/functions.es6";
import axios from "axios";

export const filtroTec21Opciones = {
  TODOS: "all",
  SOLO_TEC21: "tec21",
  EXCEPTO_TEC21: "noTec21",
};

function usePlanes() {
  const [loading, setLoading] = useState(false);
  const [planes, setPlanes] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTec21, setFiltroTec21] = useState(filtroTec21Opciones.TODOS);

  const fetchPlanes = useCallback(async () => {
    setLoading(true);
    return axios.get(`/api/planes`)
      .then(planes => {
        setPlanes(planes.data);
      })
      .catch((err) => {
        // alert(resGet.message);
        setPlanes(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setPlanes]);

  const filtrarPlanes = useCallback(() => {
    return planes?.filter((p) => {
      if (
        !stringsMatch(p.siglas, filtroNombre) &&
        !stringsMatch(p.nombre, filtroNombre)
      )
        return false;
      if (filtroTec21 !== filtroTec21Opciones.TODOS) {
        if (p.esTec21 && filtroTec21 === filtroTec21Opciones.EXCEPTO_TEC21)
          return false;
        if (!p.esTec21 && filtroTec21 === filtroTec21Opciones.SOLO_TEC21)
          return false;
      }
      return true;
    }) || [];
  }, [filtroNombre, filtroTec21, planes]);

  const handleUpdateFiltroNombre = useCallback(filtroNuevo => {
    setFiltroNombre(filtroNuevo);
  }, [setFiltroNombre])

  const handleUpdateFiltroTec21 = useCallback(filtroNuevo => {
    setFiltroTec21(filtroNuevo);
  }, [setFiltroTec21])

  const planesFiltrados = filtrarPlanes();

  return {
    planes: planesFiltrados, filtroNombre, filtroTec21, loading,
    fetchPlanes, handleUpdateFiltroNombre, handleUpdateFiltroTec21,
  }
}

export default usePlanes;
