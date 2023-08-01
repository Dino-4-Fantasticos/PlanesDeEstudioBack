

function useLogin() {
  const [loggedUser, setLoggedUser] = useState(undefined);

  const checkSession = useCallback(async () => {
    await authenticate()
      .then(resAuth => setLoggedUser(resAuth))
      .catch((err) => {
        console.error('error iniciando sesion', err);
        alert(err.message);
        setLoggedUser(null);
      });
  }, [setLoggedUser])

  return { loggedUser, checkSession }
}

export default useLogin;
