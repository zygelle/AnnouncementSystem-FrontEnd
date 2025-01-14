export const pathLogin = '/login'
export const pathCreateAds = '/anuncio/criar'
export const pathFilterAd = '/anuncio/buscar'
export const pathHome = '/'
export const pathCommunication = '/chat'
export const pathPerfil = '/meu-perfil'
export const pathMyAnnouncement = '/meus-anuncios'
export const pathEditarAnuncio = '/anuncio/editar/:id'
export const pathViewAd = `/anuncio/:id`
export const setPathVisualizarAnuncio = (id: string) => {
    return `/anuncio/${id}`
}
export const pathViewAdvertiser = '/perfil/:name'
export const setPathViewAdvertiser = (name: string) => {
    return `/perfil/${name}`
}
export const pathAssessment = '/avaliacao'
