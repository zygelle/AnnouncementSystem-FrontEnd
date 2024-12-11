export const pathLogin = '/login'
export const pathCreateAds = '/anuncio/criar'
export const pathFilterAd = '/anuncio/buscar'
export const pathHome = '/'
export const pathCommunication = '/perfil/comunicacao'
export const pathPerfil = '/perfil'
export const pathMeusAnuncios = '/perfil/anuncios'
export const pathEditarAnuncio = '/anuncio/editar/:id'
export const pathVisualizarAnuncio = `/anuncio/:id`
export const setPathVisualizarAnuncio = (id: string) => {
    return `/anuncio/${id}`
}
export const pathVizualizarAnunciante = '/anunciante/:name'
export const setPathVizualizarAnunciante = (name: string) => {
    return `/anunciante/${name}`
}
