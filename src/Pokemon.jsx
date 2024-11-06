import { useEffect, useState } from "react"
import "./index.css"
import PokemonCard from "./PokemonCard";

export const Pokemon = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("")
    const [offset, setOffset] = useState(0)
    const limit = 24

    const API = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`

    const fetchPokemon= async () => {
        try {
            const res = await fetch(API)
            const data = await res.json()
            //console.log(data)

            const detailedPokemonData = data.results.map(async(curPokemon) => {
                const res = await fetch(curPokemon.url)
                const data = await res.json()
                return data;
            })
        
            const detailedResponses = await Promise.all(detailedPokemonData)
            setPokemon(detailedResponses)
            setLoading(false)

        } catch (error) {
            //console.log(error)
            setLoading(false)
            setError(error)
        }
    }

    useEffect(() => {
        fetchPokemon()
    }, [offset])

    const searchData = pokemon.filter((currPokemon) => 
        currPokemon.name.toLowerCase().includes(search.toLowerCase())
    )

    const nextHandler = () => {
        setOffset(offset+limit)
    }

    const prevHandler = () => {
        setOffset(offset-limit < 0 ? 0 : offset-limit)
    }

    if(loading){
        return(
            <div>
                <h1>Loading....</h1>
            </div>
        )
    }

    if(error){
        return(
            <div>
                <h1>{error.message}</h1>
            </div>
        )
    }

    return(
        
            <section className="container">
                <header>
                    <h1>Let's Catch Pokemon</h1>
                </header>
                <div className="pokemon-search">
                    <input type="text" placeholder="search pokemon" value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>
                <div>
                    <ul className="cards">
                        {searchData.map((currPokemon) => {
                            return <PokemonCard key={currPokemon.id} pokemonData={currPokemon} />
                        })}
                    </ul>
                </div>
                <div className="buttons">
                    <button onClick={prevHandler} disabled={offset===0}>Previous</button>
                    <button onClick={nextHandler}>Next</button>
                </div>
            </section>
        
    )
}