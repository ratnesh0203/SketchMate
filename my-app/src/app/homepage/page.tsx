"use client"
import React from "react";
import Link from "next/link";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

interface Project {
  id: number;
  name: string;
  date: string;
  url: string;
}

function Page() {
  const { user, logOut } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);

  const [newProjectName, setNewProjectName] = useState('');

  const addProject = () => {
   router.push('/drawingPage');
  };


  const handleSignOut = async () => {
    try {
      await logOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDrawings = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, 'drawings/'); // Path to your drawings folder
      const { items } = await listAll(storageRef);

      const fetchedProjects: Project[] = await Promise.all(items.map(async (item, index) => {
        const url = await getDownloadURL(item);
        return {
          id: index + 1,
          name: item.name,
          date: new Date().toISOString().split('T')[0],
          url,
        };
      }));

      setProjects(fetchedProjects);
      setLoading(false);
    };

    fetchDrawings();
  }, []);


  return (
    <div className="py-3 flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-600 via-purple-550 to-purple-500 z-10">
      <div className="h-[10vh] py-3 flex items-center w-full px-7">
        <div className="flex flex-1">
          <ul className="flex space-x-9 items-center justify-start font-serif font-bold px-3">
            <li className="font-Bold text-4xl">SketchMate</li>
            <li className="px-9">docs</li>
            <li>project</li>
          </ul>
        </div>
        <div className="bg-purple-400 px-2 py-2 flex items-center justify-center border border-white rounded-xl">
          <p>{user ? `Welcome!!, ${user.displayName}` : "Profile"}</p>
          {user && (
            <p
              onClick={handleSignOut}
              className="font-bold cursor-pointer p-2 text-white border border-white rounded-md ml-2 hover:bg-purple-600"
            >
              log out
            </p>
          )}
        </div>
      </div>

      <div className="h-screen w-full space-x-2 space-y-2 flex flex-col ">
        <div className="mb-4 flex items-center justify-center px-4 py-8">
          <button
            onClick={addProject}
            className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 border border-white"
          >
            New Project
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Previous Projects</h2>
          <table className="min-w-full border-collapse border border-gray-200 ">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Preview</th>
                <th className="border border-gray-300 p-2">Page</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="border border-gray-300 p-2">{project.id}</td>
                  <td className="border border-gray-300 p-2">{project.name}</td>
                  <td className="border border-gray-300 p-2">{project.date}</td>
                  <td className="border border-gray-300 p-2">
                    <img src={project.url} alt={project.name} className="w-16 h-16 object-cover border border-white bg-white" />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Link href={`/drawingPage/${project.id}`} className="border border-white rounded-lg px-1 py-1 bg-blue-400 hover:bg-blue-500 ">
                      View Drawing
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Page;
