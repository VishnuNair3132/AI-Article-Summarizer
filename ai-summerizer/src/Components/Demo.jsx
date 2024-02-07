import React, { useEffect, useState } from 'react'
import { copy, linkIcon, loader, tick} from "../assets"
import { useLazyGetSummaryQuery } from '../services/article'


const Demo = () => {
    const[article,setArticle]=useState({
        url:"",
        summary:"" 
    })
    const [allArticles, setAllArticles] =useState([]);


    const [getSummary,{error, isFetching}]=useLazyGetSummaryQuery();

    const [copied, setCopied]=useState('');



    useEffect(()=>{
        const articlesFromLocalStorage =JSON.parse(
            localStorage.getItem('articles')
        )
        if(articlesFromLocalStorage) {
            setAllArticles(articlesFromLocalStorage)
        }

    },[])
    const handleSubmit = async (e)=>{
        e.preventDefault();


        const{ data } = await getSummary({
            articleUrl:article.url
        });

        if(data?.summary){
            const newArticle ={ ...article, summary:data.summary };

            const updatedAllArticles =[newArticle, ...allArticles]
            setArticle(newArticle);

            localStorage.setItem('articles' , JSON.stringify(updatedAllArticles))
        }
    }


    const handleCopy= (copyURL)=>{
        setCopied(copyURL);
        navigator.clipboard.writeText(copyURL);
        setTimeout(() => setCopied(false),3000)

    }
  return (
    <section className='mt-16 w-full max-w-xl'>
        <div
        className='flex flex-col w-full gap-2'>
        <form className='relative flex justify-center items-center' onSubmit={handleSubmit}>
            <img src={linkIcon} alt='link_icon' className='absolute left-0 my-2 ml-3 w-5'/>
            <input type='url' placeholder='Enter a URL' value={article.url} onChange={(e)=>setArticle({... article, url: e.target.value})} required className='url_input peer'/>

            <button type='submit' className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 cursor-pointer'> ↵ </button>
        </form>
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
        {allArticles.map((items,index)=>(
            <div 
            key={`link-${index}`}
            
            className='link_card'>
            <div className='copy_btn'>
            <img src={copied===items.url ? tick : copy} alt="copy_btn" onClick={()=>handleCopy(items.url)} className='w-[40%] object-contain'/>

            </div>  

            <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate' onClick={()=>setArticle(items)}>{items.url}</p> 
            </div>   


        ))}
        </div>
        </div>

        <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching?(
            <img src={loader} alt ="loader" className='w-20 h-20 object-contain'/>
        ):error ? (
            <p className='font-inter font-bold text-black text-center'>Shittt...
            <br/>
            <span className='font-satoshi font-normal text-gray-700'>
                {error?.data?.error}
            </span></p>
        
        ):(
            article.summary&& (
                <div className='flex flex-col gap-3'>
                <h2 className='font-satoshi font-bold text-gray-600'>
                    Article <span className='blue_gradient'>
                        Summary
                    </span>
                </h2>
                <div className='summary_box'>
                 <p className='text-sm font-inter font-medium text-gray-600 '>{article.summary}</p>
                 </div>
                </div>
            )
        )}

        </div>

        
    </section>
  )
}

export default Demo