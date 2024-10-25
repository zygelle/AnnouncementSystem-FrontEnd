import  Header  from '../../../components/header';
import { useState } from "react";
import {Input} from '../../../components/forms/Input'
import { Textarea } from '../../../components/forms/Textarea';

const categories = ['Categoria 1', 'Categoria 2', 'Categoria 3'];


export function CriarAnuncio(){
    const [descricao, setDescricao] = useState('');


     async function criar(e) {
        e.preventDefault();

        const data = {
            descricao
        }
     }
    return(
        
        <div className="flex flex-col bg-slate-100 items-center justify-center">
            <Header></Header>
            <main className="w-full max-w-3xl flex flex-col p-8 rounded-lg bg-white shadow-2x mb-20 ">
                <div className="flex gap-2.5 mt-5 max-w-full ">
                    <form onSubmit={criar} className='flex flex-wrap grid grid-cols-2' >
                    <div>
                        <label className="mb-2">Descricao do Anuncio</label>
                            <Input
                            placeholder="Descricao do Anuncio"
                            type="text"
                            value={descricao}
                            onChange={ (e) => (e.target.value) }
                            />
                    </div>
                    <div>
                        <label className="mb-2">Descricao do Anuncio</label>
                        <Textarea></Textarea>
                    </div>

                    
                    

                    <button 
                    type="submit"
                    className="h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white">
                        Entrar
                    </button>
                </form>
                </div>
            </main>
        </div>
    )

}