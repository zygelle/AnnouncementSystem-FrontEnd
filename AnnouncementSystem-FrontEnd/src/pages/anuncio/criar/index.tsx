import  Header  from '../../../components/Navbar.tsx';
import { useState } from "react";
import {Input} from '../../../components/forms/Input'
import { Textarea } from '../../../components/forms/Textarea';
import CreatableSelect from 'react-select/creatable';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";



const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

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

        <div className="main-layout">
            <main className="main-content">
                <div className="gap-2.5 mt-5 max-w-full ">
                    <form onSubmit={criar} className='grid grid-cols-6 gap-4' >

                    <Carousel className='col-span-2 col-start-3 col-end-5 row-span-4' responsive={responsive}>
                        <div>
                            <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/373b523e13e642948ff7f7e522970fd3/9834cd509f3acada339e69a8ce9444326495eb23a777014a17998b8de011849f?apiKey=373b523e13e642948ff7f7e522970fd3&"

                            className="object-contain w-52 aspect-[0.84] min-h-[247px]"
                            />
                        </div>
                        <div>
                            <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/373b523e13e642948ff7f7e522970fd3/9834cd509f3acada339e69a8ce9444326495eb23a777014a17998b8de011849f?apiKey=373b523e13e642948ff7f7e522970fd3&"

                            className="object-contain w-52 aspect-[0.84] min-h-[247px]"
                            />
                        </div>
                       <div>
                            <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/373b523e13e642948ff7f7e522970fd3/9834cd509f3acada339e69a8ce9444326495eb23a777014a17998b8de011849f?apiKey=373b523e13e642948ff7f7e522970fd3&"

                            className="object-contain w-52 aspect-[0.84] min-h-[247px]"
                            />
                        </div>
                    </Carousel>

                    <div className='col-start-3 col-span-1'>
                        <Input name='radio' aria-label='busca' value="Busca" type='radio' className='border border-slate-300 rounded-md outline-none px-2 mb-4 '></Input>
                        <label for="busca" className=' ml-2 align-top accent-black-100'>Busca</label>

                    </div>

                    <div className='col-start-4 col-span-1'>
                        <Input name='radio' id="busca" aria-label='oferta' value="Oferta" type='radio' className='border border-slate-300 rounded-md outline-none px-2 mb-4 '></Input>
                        <label for="oferta"className='ml-2 align-top'>Oferta</label>
                    </div>

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