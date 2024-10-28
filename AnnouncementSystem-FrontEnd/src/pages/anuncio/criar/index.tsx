import  Header  from '../../../components/header';
import { useState } from "react";
import {Input} from '../../../components/forms/Input'
import { Textarea } from '../../../components/forms/Textarea';
import CreatableSelect from 'react-select/creatable';


const formatGroupLabel = (data: any) => (
    <div>
      <span>{data.label}</span>
    </div>
  );

  const dogOptions = [
    { value: 'Chihuahua' , label: 'Chihuahua'},
    { value: 'Bulldog', label: 'Bulldog' },
    { value: 'Dachshund', label: 'Dachshund' },
    { value: 'Akita', label: 'Akita' },
  ];

  const catOptions = [
    {value: 'cat1', label: 'cat1'}

  ]

export function CriarAnuncio(){
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [email, setEmail] = useState('')
    


     async function criar(e) {
        e.preventDefault();

        const data = {
            descricao,
            preco,
            email
            
        }

        
     }
    return(
        
        <div className="flex flex-col bg-slate-100 items-center justify-center">
            <Header></Header>
            <main className="w-full max-w-3xl flex flex-col p-8 rounded-lg bg-white shadow-2x mb-20 ">
                <div className="gap-2.5 mt-5 max-w-full ">
                    <form onSubmit={criar} className='grid grid-cols-6 gap-4' >
                    <div className='col-span-3'>
                        <label className="mb-2">Descricao do Anuncio</label>
                        <Textarea rows="4"></Textarea>
                        

                    </div>
                    <div className='col-span-3'>
                        <label className='mb-2'>Localização</label>
                        <CreatableSelect isClearable isMulti className='mb-2 w-full' options={dogOptions} placeholder="Cidade"/>
                        <label className='mb-2'>Categorias</label>
                        <CreatableSelect isClearable isMulti className='mb-2' options={catOptions} placeholder="Categorias"/>
                        
                        
                    </div>
                    <div className='col-span-3'>


                    <label className="mb-2">Preço (R$)</label>
                            <Input
                                className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                placeholder="0.0"
                                defaultValue="0.0"
                                step={.01}
                                type="number"
                                value={preco}
                                onChange={ (e) => setPreco(e.target.value) }
                         />
                    </div>
                    <div className='col-span-3'>
                        <label className="mb-2">Contato</label>
                                <Input
                                    className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                    placeholder='Email'
                                    type="text"
                                    value={email}
                                    onChange={ (e) => setEmail(e.target.value) }
                            />
                    </div>
                    
                    <button
                        type="reset"
                        className="col-start-3 h-9 hover:bg-slate-200 rounded border-slate-200 border-2 text-lg">
                            Cancelar
                        </button>
                        <button
                        type="submit"
                        className="h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white">
                            Anunciar
                    </button>
                </form>
                </div>
            </main>
        </div>
    )

}