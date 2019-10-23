import { Quotations, WallType, Extra, Comments, Information } from "./bricks"


export const brickType : Quotations[] = [
        {image: '../../assets/imgs/Sand-Lime brick.jpg', name: 'Sand-Lime brick',length: 123, width: 60, height: 12, description: 'The offered Sand Lime Bricks have several advantages like high strength, small bulk density, no cracks and shrinkage.'},
        // {image: '../../assets/imgs/Burnt clay brick.jpg', name: 'Burnt clay brick ',length:  190  , width:  90, height:  90, description: 'Common burnt clay bricks are the oldest and most extensively used construction material. '},
        {image: '../../assets/imgs/Engineering brick.jpg', name: 'Engineering brick',length: 123, width: 60, height: 12, description: 'Engineering bricks have high compressive strength and low water absorption.'},
        {image: '../../assets/imgs/Fly ash brick.jpg', name: 'Fly ash brick',length: 123, width: 60, height: 12, description: 'Building material, specifically masonry units, containing class C or class F fly ash and water.'},
        {image: '../../assets/imgs/Concrete brick.jpg', name: 'Concrete brick',length: 123, width: 60, height: 12, description: 'Concrete brick is a mixture of cement and aggregate, usually sand, formed in molds and cured.'},
        // {image: '../../assets/imgs/Burnt-clay brick.jpg', name: 'Burnt-clay brick',length: 123, width: 60, height: 12, description: 'These are the classic form of brick, created by pressing wet clay into molds, then drying and firing them in kilns.'}

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
    {comment: 'Unavailable on weekdays'},
    
];
export const Informations: Information[] =  [
    { info: 'About Us',form: false, description: ' Pleas feel free to contact us'}, 
    { info: 'Terms Of Use', form: false,description: 'You need to accept our terms Once you have access to our Application, you are required to abide by our policies and regulations and include our Privacy Policy.'}, 
    { info: 'Contact Us',form: true, description: ' By using this application, you agree to Yakha use of cookies to enhance site functionality and performance and to show you ads for yakha products other application'  }, 
    { info: 'Disclaimer',form: false, description: 'Several fantastic pieces of free and open-source software have really helped get Spotify to where it is today.A few require that we include their licence Agreements within our product.'},
    { info: 'Safety Information',form: false, description: 'We keep your personal information private and safe and put you in control'}
  ]
