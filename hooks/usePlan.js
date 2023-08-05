import React, { useState, useCallback } from "react";
import axios from "axios";

function usePlan() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(undefined);

  const cargarPlan = useCallback((siglas) => {
    setLoading(true);
    return axios.get(`/api/planes/${siglas}`)
      .then(res => {
        setPlan(res.data);
      })
      .catch((err) => {
        alert(err?.body?.msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const guardarPlan = useCallback(async (plan) => {
    setLoading(true);
    return axios.post(`/api/planes`, plan)
      .then(res => {
        alert(res.data.msg);
        window.location = "/planes";
        return res;
      })
      .catch((err) => {
        console.error('error al guardar plan', err);
        return err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const actualizarPlan = useCallback(async (plan) => {
    setLoading(true);
    const siglas = plan.siglas;
    delete plan.siglas;
    return axios.post(`/api/planes/${siglas}`, plan)
      .then(res => {
        alert(res.data.msg);
        window.location = "/planes";
        return res;
      })
      .catch((err) => {
        console.error('error al actualizar plan', err);
        alert(resPut?.body?.msg);
        return err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const eliminarPlan = useCallback(async (plan) => {
    const confirmMessage = `Se eliminará el plan de estudios ${plan.siglas}. ¿Continuar?`;
    if (!window.confirm(confirmMessage)) return;
    
    setLoading(true);
    await axios.delete(`/api/planes/${plan.siglas}`)
      .then(res => {
        alert(res.data.msg);
        window.location = "/planes";
      })
      .catch((err) => {
        alert(err?.response?.data?.msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, guardarPlan, actualizarPlan, cargarPlan, eliminarPlan, plan }
}

export default usePlan;
