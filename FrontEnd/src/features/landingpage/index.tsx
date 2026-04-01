"use client"
import { useState } from "react";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  return (
    <div className="bg-gray-300 p-4 text-black">
      
      <div className="flex items-center justify-between">
        
        <img src="/ShoPIM-removebg.png" className="h-16" />

        <ul className="hidden md:flex gap-7 items-center">
          <li><a href="#">Início</a></li>
          <li><a href="#">Categorias</a></li>
          <li><a href="#">Ofertas</a></li>
        </ul>

        <button 
          className="md:hidden text-2xl"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </div>

      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}>

       
        <button 
          className="p-4 text-xl"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <ul className="flex flex-col gap-4 p-4">
          <li><a href="#">Início</a></li>
          <li>
            <button 
              onClick={() => setOpenCategory(!openCategory)}
              className="flex justify-between w-full"
              >
                Categorias
                <span>{openCategory ? "▲" : "▼"}</span>
              </button>

              {openCategory && (
                <ul className="ml-4 mt-2 flex flex-col gap-2 text-sm">
                  <li><a>Eletrônicos</a></li>
                  <li><a>Roupas</a></li>
                  <li><a>Acessórios</a></li>
                </ul>
              )}
          </li>
          <li><a href="#">Ofertas</a></li>
        </ul>
      </div>

      {open && (
        <div 
          className="fixed inset-0 bg-black opacity-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Page;