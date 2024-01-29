"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { HiOutlinePlusSm } from "react-icons/hi";

enum ACTION_MODAL {
  EDIT,
  DELETE,
  CREATE,
}
interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
}
const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputSearch, setInputSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dataModal, setDataModal] = useState<User | null>(null);
  const [actionModalSelected, setActionModalSelected] =
    useState<ACTION_MODAL | null>(null);
  const usersFiltered = users.filter(
    (user) =>
      user?.email?.includes(inputSearch) ||
      user?.displayName?.includes(inputSearch) ||
      user?.uid?.includes(inputSearch)
  );
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
    setLoading(true);
    const getUsers = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUsers(data.users);
      setLoading(false);
    };
    getUsers();
  }, []);

  const actionWithModal = (actionModal: ACTION_MODAL, user?: User) => {
    if (actionModal == ACTION_MODAL.CREATE) {
      setShowModal(true);
      setActionModalSelected(actionModal);
      setDataModal(null);
    } else {
      setShowModal(true);
      setActionModalSelected(actionModal);
      if (user) {
        setDataModal(user);
      }
    }
  };

  return (
    <main>
      {showModal && (
        <Modal
          dataModal={dataModal}
          closeModal={() => setShowModal(false)}
          actionModalSelected={actionModalSelected}
          reloadUsers={() => {
            setLoading(true);
            setUsers([]);
            const getUsers = async () => {
              const res = await fetch("/api/user");
              const data = await res.json();
              setUsers(data.users);
              setLoading(false);
            };
            getUsers();
          }}
          resetModal={() => {
            setActionModalSelected(null);
            setDataModal(null);
          }}
        />
      )}
      <div className="pb-4 bg-white dark:bg-gray-900">
        <div className="relative mt-1">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            value={inputSearch}
            onChange={(e) => setInputSearch(e.currentTarget.value)}
            type="text"
            className="block py-2  ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            <div className="flex justify-between">
              <div>
                Nuestros Usuarios
                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Lista de usuarios registrados en nuestro sistema. Aqui
                  podremos buscar, editar y eliminar usuarios.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => actionWithModal(ACTION_MODAL.CREATE)}
                  className="
                    py-2 px-4
                    flex
                    gap-2
                    items-center
                    rounded-md
                    bg-cyan-600
                    font-medium text-cyan-100 hover:underline text-md"
                >
                  <HiOutlinePlusSm />
                  Crear nuevo Usuario
                </button>
              </div>
            </div>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                id
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                EmailVerified
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                displayName
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Options</span>
              </th>
            </tr>
          </thead>
          {loading && (
            <tbody className="text-sm font-medium text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <Loader />
                </td>
              </tr>
            </tbody>
          )}
          {!loading && users.length === 0 && (
            <tbody className="text-sm font-medium text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <h3 className="">No hay usuarios registrados</h3>
                </td>
              </tr>
            </tbody>
          )}
          {!loading && usersFiltered.length === 0 && users.length != 0 && (
            <tbody className="text-sm font-medium text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <h3 className="">
                    No se encontraron usuarios con los valores de {inputSearch}
                  </h3>
                </td>
              </tr>
            </tbody>
          )}

          <tbody>
            {usersFiltered.map((user) => (
              <tr key={user.uid} className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.uid}
                </th>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-center">
                  {user.emailVerified ? "si" : " no"}
                </td>
                <td className="px-6 py-4 text-center">
                  {user.displayName ?? "----------"}
                </td>
                <td className="px-6 py-4 ">
                  <div className="flex gap-4 flex-wrap min-w-80 justify-center">
                    <button
                      onClick={() => actionWithModal(ACTION_MODAL.EDIT, user)}
                      className="
                    py-2 px-4
                    flex
                    gap-2
                    items-center
                    rounded-md
                    bg-blue-600
                    font-medium text-blue-100 hover:underline"
                    >
                      <FaRegEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => actionWithModal(ACTION_MODAL.DELETE, user)}
                      className="   py-2 px-4
                    flex
                    gap-2
                    items-center
                    rounded-md
                     font-medium bg-red-600 text-red-100 hover:underline"
                    >
                      <MdDelete />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default Dashboard;
interface ModalProps {
  closeModal: () => void;
  dataModal: User | null;
  actionModalSelected: ACTION_MODAL | null;
  reloadUsers: () => void;
  resetModal: () => void;
}
const Modal = ({
  dataModal,
  closeModal,
  actionModalSelected,
  reloadUsers,
  resetModal,
}: ModalProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setCredentials({
      email: dataModal?.email ?? "",
      displayName: dataModal?.displayName ?? "",
      password: "",
    });
    setUser({
      email: dataModal?.email ?? "",
      displayName: dataModal?.displayName ?? "",
      emailVerified: dataModal?.emailVerified ?? false,
      uid: dataModal?.uid ?? "",
    });
  }, [
    dataModal?.displayName,
    dataModal?.email,
    dataModal?.emailVerified,
    dataModal?.uid,
  ]);
  const onChange = (e: FormEvent<HTMLInputElement>) => {
    setError("");
    setCredentials({
      ...credentials,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("submit");
    e.preventDefault();
    setLoading(true);
    setError("");

    if (actionModalSelected == ACTION_MODAL.EDIT) {
      const res = await fetch(`/api/user/${user?.uid}`, {
        method: "PUT",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      await reloadUsers();
      resetModal();
      closeModal();
    }
    if (actionModalSelected == ACTION_MODAL.DELETE) {
      const res = await fetch(`/api/user/${user?.uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      await reloadUsers();
      resetModal();
      closeModal();
    }
    if (actionModalSelected == ACTION_MODAL.CREATE) {
      const res = await fetch(`/api/user`, {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      await reloadUsers();
      resetModal();
      closeModal();
    }
  };

  const contentFormEdit = () => {
    return (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Nombre de Usuario
          </label>
          <input
            autoFocus
            defaultValue={dataModal?.displayName}
            disabled={loading}
            value={credentials.displayName}
            onChange={onChange}
            type="text"
            name="displayName"
            required
            id="displayName"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
            disabled:opacity-50 disabled:cursor-not-allowed
            "
            placeholder="Nombre de Usuario"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Correo
          </label>
          <input
            disabled={loading}
            value={credentials.email}
            onChange={onChange}
            type="text"
            name="email"
            required
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
            disabled:opacity-50 disabled:cursor-not-allowed
            "
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Contraseña
          </label>
          <input
            disabled={loading}
            value={credentials.password}
            onChange={onChange}
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
            disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center "
        >
          {loading ? <Loader2 /> : "Actualizar"}
        </button>
        <button
          onClick={closeModal}
          disabled={loading}
          type="button"
          className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center 
      disabled:opacity-50 disabled:cursor-not-allowed
      "
        >
          Cancelar
        </button>
        <p className="text-sm font-light text-gray-500 ">
          Cualquier problema?{" "}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            fabrizio@ecoding.dev
          </a>
        </p>
      </>
    );
  };
  const contentFormCreate = () => {
    return (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Nombre de Usuario
          </label>
          <input
            autoFocus
            defaultValue={dataModal?.displayName}
            disabled={loading}
            value={credentials.displayName}
            onChange={onChange}
            type="text"
            name="displayName"
            required
            id="displayName"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
            disabled:opacity-50 disabled:cursor-not-allowed
            "
            placeholder="Nombre de Usuario"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Correo
          </label>
          <input
            disabled={loading}
            value={credentials.email}
            onChange={onChange}
            type="text"
            name="email"
            required
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
            disabled:opacity-50 disabled:cursor-not-allowed
            "
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Contraseña
          </label>
          <input
            required
            disabled={loading}
            value={credentials.password}
            onChange={onChange}
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
            disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center "
        >
          {loading ? <Loader2 /> : "Crear"}
        </button>
        <button
          onClick={closeModal}
          disabled={loading}
          type="button"
          className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center 
      disabled:opacity-50 disabled:cursor-not-allowed
      "
        >
          Cancelar
        </button>
        <p className="text-sm font-light text-gray-500 ">
          Cualquier problema?{" "}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            fabrizio@ecoding.dev
          </a>
        </p>
      </>
    );
  };
  const contentFormDelete = () => {
    return (
      <>
        <div className="">
          Esta seguro que desea eliminar el usuario{" "}
          <span className="font-bold">{user?.email} ?</span>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center "
        >
          {loading ? <Loader2 /> : "Si, Eliminar"}
        </button>
        <button
          onClick={closeModal}
          disabled={loading}
          type="button"
          className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center 
      disabled:opacity-50 disabled:cursor-not-allowed
      "
        >
          Cancelar
        </button>
        <p className="text-sm font-light text-gray-500 ">
          Cualquier problema?{" "}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            fabrizio@ecoding.dev
          </a>
        </p>
      </>
    );
  };

  return (
    <div className="sm:pl-64 inset-0 w-full h-screen fixed z-10 bg-[#ffffff] pt-14">
      <div className="rounded-md mt-8 bg-white p-6 space-y-4 md:space-y-6 sm:p-8 max-w-4xl  mx-auto">
        <div className="flex items-center justify-center flex-col">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            {actionModalSelected == ACTION_MODAL.EDIT && "Editar Usuario"}
            {actionModalSelected == ACTION_MODAL.DELETE && "Eliminar Usuario"}
            {actionModalSelected == ACTION_MODAL.CREATE && "Crear Usuario"}
          </h1>
          <span>{user?.uid}</span>
        </div>
        {error && (
          <div className="w-full p-4 bg-red-200 text-red-800 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 md:space-y-6" action="#">
          {actionModalSelected == ACTION_MODAL.EDIT && contentFormEdit()}
          {actionModalSelected == ACTION_MODAL.DELETE && contentFormDelete()}
          {actionModalSelected == ACTION_MODAL.CREATE && contentFormCreate()}
        </form>
      </div>
    </div>
  );
};

const Loader = () => {
  return (
    <div role="status" className="flex items-center gap-2 justify-center my-2">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-white animate-spin  fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="text-md text-white">Loading...</span>
    </div>
  );
};
const Loader2 = () => {
  return (
    <div role="status" className="flex items-center gap-2">
      <svg
        aria-hidden="true"
        className="w-4 h-4 text-white animate-spin  fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="text-md text-white">Loading...</span>
    </div>
  );
};
