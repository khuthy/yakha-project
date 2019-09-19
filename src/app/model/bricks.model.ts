import { Quotations, WallType, Extra } from "./bricks"


export const brickType : Quotations[] = [
        {image: '../../assets/imgs/sand-Lime-bricks-600x387.jpg', name: 'Sand-Lime bricks',length: 123, width: 60, height: 12, description: 'You need 35 palet for single wall and 72 pallet for double walls'},
        {image: '../../assets/imgs/common-burnt-clay-bricks.jpg', name: 'Common burnt clay bricks',length: 123, width: 60, height: 12, description: 'You need 35 palet for single wall and 72 pallet for double walls'},
        {image: '../../assets/imgs/engineering-bricks-600x263.jpg', name: 'Engineering bricks',length: 123, width: 60, height: 12, description: 'You need 35 palet for single wall and 72 pallet for double walls'},
        {image: '../../assets/imgs/fly-ash-bricks-600x319.jpg', name: 'Fly ash bricks',length: 123, width: 60, height: 12, description: 'You need 35 palet for single wall and 72 pallet for double walls'},
        {image: '../../assets/imgs/concrete-bricks.jpg', name: 'Concrete bricks',length: 123, width: 60, height: 12, description: 'You need 35 palet for single wall and 72 pallet for double walls'},
        {image: '../../assets/imgs/burnt-clay-bricks.jpg', name: 'Burnt-claybricks',length: 123, width: 60, height: 12, description: 'You need 35 palet for single wall and 72 pallet for double walls'}

];
export const wallTypes : WallType[] = [
    {name: 'Single Wall'},
    {name: 'Double Wall'}
]
export const Extras: Extra[] = [
    {service: 'Roofing', price: 0, quantity: 0},
    {service: 'Ceiling', price: 0, quantity: 0},
    {service: 'Doors', price: 0, quantity: 0},
    {service: 'Plumbing', price: 0, quantity: 0},
    {service: 'Plaster', price: 0, quantity: 0},
    {service: 'Electricity wires', price: 0, quantity: 0},
    {service: 'Windows', price: 0, quantity: 0}
]