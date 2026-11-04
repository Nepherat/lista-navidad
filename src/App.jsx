
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './styles/neku.css'
import './styles/kima.css'

function CarruselImagenes({ imagenes, nombre, listaActiva }) {
  const [indiceActual, setIndiceActual] = useState(0)
  const [ampliada, setAmpliada] = useState(false)

  if (!imagenes || imagenes.length === 0) {
    return null
  }

  const imagenAnterior = () => {
    setIndiceActual(indice =>
      (indice - 1 + imagenes.length) % imagenes.length
    )
  }

  const imagenSiguiente = () => {
    setIndiceActual(indice =>
      (indice + 1) % imagenes.length
    )
  }

  return (
    <>
      <div className="carrusel-imagenes">
        <img
          src={imagenes[indiceActual]}
          alt={nombre}
          onClick={() => setAmpliada(true)}
        />

        {imagenes.length > 1 && (
          <>
            <button
              className="flecha flecha-anterior"
              onClick={imagenAnterior}
              aria-label="Ver imagen anterior"
            >
              ‹
            </button>

            <button
              className="flecha flecha-siguiente"
              onClick={imagenSiguiente}
              aria-label="Ver imagen siguiente"
            >
              ›
            </button>
          </>
        )}
      </div>

      {ampliada && createPortal(
        <div className={`app-${listaActiva}`}>
          <div
            className="visor-ampliado"
            onClick={() => setAmpliada(false)}
          >
            <div
              className="imagen-ampliada"
              onClick={evento => evento.stopPropagation()}
            >
              <button
                className="cerrar-visor"
                onClick={() => setAmpliada(false)}
                aria-label="Cerrar imagen"
              >
                ×
              </button>

              <img
                src={imagenes[indiceActual]}
                alt={nombre}
              />

              {imagenes.length > 1 && (
                <>
                  <button
                    className="flecha flecha-anterior"
                    onClick={imagenAnterior}
                    aria-label="Ver imagen anterior"
                  >
                    ‹
                  </button>

                  <button
                    className="flecha flecha-siguiente"
                    onClick={imagenSiguiente}
                    aria-label="Ver imagen siguiente"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

function App() {
  const [regalos, setRegalos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos')
  const [listaActiva, setListaActiva] = useState('neku')

  const updateRegalos = async () => {
    setIsLoading(true)

    const archivo = listaActiva === 'neku'
      ? '/regalos.json'
      : '/regalos-kima.json'

    const response = await fetch(archivo)
    const regalos = await response.json()

    setRegalos(regalos)
    setIsLoading(false)
  }

  useEffect(() => {
    updateRegalos()
  }, [listaActiva])

  const cambiarLista = (lista) => {
    setListaActiva(lista)
    setCategoriaSeleccionada('Todos')
  }

  return (
    <div className={`app app-${listaActiva}`}>
      <header>
        <h1>
          {listaActiva === 'neku'
            ? 'Lista de Navidad de Penélope'
            : 'Lista de Navidad de Kilian'}
        </h1>

        <nav className="selector-listas">
          <button
            onClick={() => cambiarLista(listaActiva === 'neku' ? 'kima' : 'neku')}
          >
            {listaActiva === 'neku' ? 'Cambiar a Kilian' : 'Cambiar a Penélope'}
          </button>
        </nav>

        <nav className="filtros">
          <button onClick={() => setCategoriaSeleccionada('Todos')}>Todos</button>
          <button onClick={() => setCategoriaSeleccionada('Ropa')}>Ropa</button>
          <button onClick={() => setCategoriaSeleccionada('Libros')}>Libros</button>
          <button onClick={() => setCategoriaSeleccionada('Electrónica')}>Electrónica</button>
        </nav>
      </header>

      <div className="regalos">
        {isLoading && <p>Cargando regalos...</p>}

        {regalos
          .filter(regalo =>
            categoriaSeleccionada === 'Todos' ||
            regalo.categoria === categoriaSeleccionada
          )
          .map(regalo => (
            <article className="regalo" key={`${listaActiva}-${regalo.id}`}>
              <CarruselImagenes
                imagenes={regalo.imagenes}
                nombre={regalo.nombre}
                listaActiva={listaActiva}
              />

              <div>
                <h3>{regalo.nombre}</h3>
                <p>Categoría: {regalo.categoria}</p>

                {regalo.categoria === 'Ropa' && (
                  <p>Talla: {regalo.talla}</p>
                )}

                {regalo.categoria === 'Libros' && (
                  <p>ISBN: {regalo.isbn}</p>
                )}

                {regalo.categoria === 'Electrónica' && (
                  <p>Marca: {regalo.marca}</p>
                )}

                <p>Tienda: {regalo.tienda}</p>
                <p>Precio: {regalo.precio} €</p>

                <a href={regalo.enlace} target="_blank" rel="noreferrer">
                  Ver producto
                </a>
              </div>
            </article>
          ))}
      </div>
    </div>
  )
}

export default App
