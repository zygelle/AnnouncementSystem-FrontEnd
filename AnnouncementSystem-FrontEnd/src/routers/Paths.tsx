export const pathLogin = '/login'
export const pathCreateAds = '/anuncio/criar'
export const pathFilterAd = '/anuncio/buscar'
export const pathHome = '/'
export const pathCommunication = '/comunicacao'
export const pathPerfil = '/meu-perfil'
export const pathMeusAnuncios = '/meus-anuncios'
export const pathEditarAnuncio = '/anuncio/editar/:id'
export const pathVisualizarAnuncio = `/anuncio/:id`
export const setPathVisualizarAnuncio = (id: string) => {
    return `/anuncio/${id}`
}
export const pathVizualizarAnunciante = '/perfil/:name'
export const setPathVizualizarAnunciante = (name: string) => {
    return `/perfil/${name}`
}
export const pathAssessment = '/avaliacao'
