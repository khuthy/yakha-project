import { Quotations, WallType, Extra, Comments, Information } from "./bricks"


export const brickType : Quotations[] = [
        {image: '../../assets/imgs/sand-Lime-bricks-600x387.jpg', name: 'Sand-Lime brk',length: 123, width: 60, height: 12, description: 'The offered Sand Lime Bricks have several advantages like high strength, small bulk density, no cracks and shrinkage.'},
        {image: '../../assets/imgs/common-burnt-clay-bricks.jpg', name: 'Burnt clay brk ',length:  190  , width:  90, height:  90, description: 'Common burnt clay bricks are the oldest and most extensively used construction material. '},
        {image: '../../assets/imgs/engineering-bricks-600x263.jpg', name: 'Engineering brk',length: 123, width: 60, height: 12, description: 'Engineering bricks have high compressive strength and low water absorption.'},
        {image: '../../assets/imgs/fly-ash-bricks-600x319.jpg', name: 'Fly ash brk',length: 123, width: 60, height: 12, description: 'Building material, specifically masonry units, containing class C or class F fly ash and water.'},
        {image: '../../assets/imgs/concrete-bricks.jpg', name: 'Concrete brk',length: 123, width: 60, height: 12, description: 'Concrete brick is a mixture of cement and aggregate, usually sand, formed in molds and cured.'},
        {image: '../../assets/imgs/burnt-clay-bricks.jpg', name: 'Burnt-clay brk',length: 123, width: 60, height: 12, description: 'These are the classic form of brick, created by pressing wet clay into molds, then drying and firing them in kilns.'}

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
    {icon: 'mail', info: 'Contact Us',form: true, description: ' Pleas feel free to contact us'}, 
    {icon: 'person', info: 'Terms Of Use', form: false,description: 'You need to accept our terms Once you have access to our Application, you are required to abide by our policies and regulations and include our Privacy Policy.'}, 
    {icon: 'information-circle', info: 'Legal Information',form: false, description: ' By using this application, you agree to Yakha use of cookies to enhance site functionality and performance and to show you ads for yakha products other application'  }, 
    {icon: 'open', info: 'Open Source Licenses',form: false, description: 'Several fantastic pieces of free and open-source software have really helped get Spotify to where it is today.A few require that we include their licence Agreements within our product.'},
    {icon: 'lock', info: 'Privacy Policy', form: false,description: 'This privacy policy governs your use of the software Application YAKHA for mobile devices that was created by GEEKYVIBES. The application is basic description of the app (features, functionality and content)'},
    {icon: 'information-circle', info: 'Safety Information',form: false, description: 'We keep your personal information private and safe and put you in control'}
  ]
