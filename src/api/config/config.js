// src/api/config.js
export const ENDPOINTS = {
    auth: {
        login: '/auth/token/',
        refresh: '/auth/token/refresh/',
        me: '/auth/me/',
    },
    actors: {
        list: '/actors/actors/',
        detail: (id) => `/actors/actors/${id}/`,
    },
    economy: {
        products: '/economy/products/',
        productDetail: (id) => `/economy/products/${id}/`,
        currencies: '/economy/currencies/',
        tags: '/economy/tags/',
    },
    internal: {
        inventory: (actorId) => `/internal/actor/${actorId}/inventory/`,
        wallet: (actorId) => `/internal/actor/${actorId}/wallet/`,
        inventoryUpdate: '/internal/inventory/update/',
        walletUpdate: '/internal/wallet/update/',
    },
};