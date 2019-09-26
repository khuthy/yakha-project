import { Quotations, WallType, Extra, Comments, Information } from "./bricks"


export const brickType : Quotations[] = [
        {image: '../../assets/imgs/sand-Lime-bricks-600x387.jpg', name: 'Sand-Lime bricks',length: 123, width: 60, height: 12, description: 'The offered Sand Lime Bricks have several advantages like high strength, small bulk density, no cracks and shrinkage.'},
        {image: '../../assets/imgs/common-burnt-clay-bricks.jpg', name: 'Common burnt clay bricks',length:  190  , width:  90, height:  90, description: 'Common burnt clay bricks are the oldest and most extensively used construction material. '},
        {image: '../../assets/imgs/engineering-bricks-600x263.jpg', name: 'Engineering bricks',length: 123, width: 60, height: 12, description: 'Engineering bricks have high compressive strength and low water absorption.'},
        {image: '../../assets/imgs/fly-ash-bricks-600x319.jpg', name: 'Fly ash bricks',length: 123, width: 60, height: 12, description: 'Building material, specifically masonry units, containing class C or class F fly ash and water.'},
        {image: '../../assets/imgs/concrete-bricks.jpg', name: 'Concrete bricks',length: 123, width: 60, height: 12, description: 'Concrete brick is a mixture of cement and aggregate, usually sand, formed in molds and cured.'},
        {image: '../../assets/imgs/burnt-clay-bricks.jpg', name: 'Burnt-clay bricks',length: 123, width: 60, height: 12, description: 'These are the classic form of brick, created by pressing wet clay into molds, then drying and firing them in kilns.'}

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
];
export const comment: Comments[] = [
    {comment: 'I need this urgently'},
    {comment: 'Come with your lunch box'},
    {comment: 'i will pay you like yesterday'},
    {comment: 'Great work only'},
    {comment: 'I will not be around during working days'},
    {comment: ''}
];
export const Informations: Information[] =  [
    {icon: 'information-circle', info: 'About Us', description: ''}, 
    {icon: 'information-circle', info: 'Terms Of Use', description: ''}, 
    {icon: 'information-circle', info: 'Legal Information', description: ''}, 
    {icon: 'information-circle', info: 'Open Source Licenses', description: ''},
    {icon: 'logo-google',        info: 'Google Legal', description: ''},
    {icon: 'information-circle', info: 'Privacy Policy', description: ''},
    {icon: 'information-circle', info: 'Safety Information', description: ''}
  ]
