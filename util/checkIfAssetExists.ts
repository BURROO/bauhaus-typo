
import assets from '@/public/assets.json'

export const checkIfAssetExists = (url: string) => {
    return assets.includes(url)
}