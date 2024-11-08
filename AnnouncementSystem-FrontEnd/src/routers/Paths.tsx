export const pathLogin = '/login'
export const pathCreateAds = '/anuncio/criar'
export const pathFilterAd = '/anuncio/buscar'
export const pathHome = '/'
export const pathCommunication = '/perfil/comunicacao'
export const pathPerfil = '/perfil'
export const pathMeusAnuncios = '/perfil/anununcios'
export const pathVisualizarAnuncio = `/anunico/:id`
export const setPathVisualizarAnuncio = (id: string) => {
    return `/anunico/${id}`
}