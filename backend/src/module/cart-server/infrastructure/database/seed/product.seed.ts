import { faker } from '@faker-js/faker';
import { cartDataSource, options } from '../data-source';
import { ProductEntity } from '../../../domain/product/product.entity';

// hardcoded products for all microservices
const products: Partial<ProductEntity>[] = [
    {
        id: 1,
        name: 'iPhone 15 Pro',
        description: 'Apple smartphone with A17 Pro chip and titanium body.',
        image_url: 'https://picsum.photos/seed/iphone15pro/640/480',
        price: 139999,
    },
    {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with 200MP camera.',
        image_url: 'https://picsum.photos/seed/s24ultra/640/480',
        price: 129999,
    },
    {
        id: 3,
        name: 'MacBook Air M3',
        description: 'Lightweight Apple laptop powered by M3 chip.',
        image_url: 'https://picsum.photos/seed/macbookairm3/640/480',
        price: 154999,
    },
    {
        id: 4,
        name: 'Dell XPS 15',
        description: 'High-performance ultrabook with InfinityEdge display.',
        image_url: 'https://picsum.photos/seed/dellxps15/640/480',
        price: 179999,
    },
    {
        id: 5,
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise cancelling headphones.',
        image_url: 'https://picsum.photos/seed/sonyxm5/640/480',
        price: 29999,
    },
    {
        id: 6,
        name: 'Apple AirPods Pro 2',
        description: 'Wireless earbuds with active noise cancellation.',
        image_url: 'https://picsum.photos/seed/airpodspro2/640/480',
        price: 24999,
    },
    {
        id: 7,
        name: 'iPad Pro 12.9',
        description: 'Apple tablet with Liquid Retina XDR display.',
        image_url: 'https://picsum.photos/seed/ipadpro/640/480',
        price: 119999,
    },
    {
        id: 8,
        name: 'Samsung Galaxy Tab S9',
        description: 'Android flagship tablet with AMOLED display.',
        image_url: 'https://picsum.photos/seed/tabs9/640/480',
        price: 89999,
    },
    {
        id: 9,
        name: 'Logitech MX Master 3S',
        description: 'Advanced wireless productivity mouse.',
        image_url: 'https://picsum.photos/seed/mxmaster3s/640/480',
        price: 9999,
    },
    {
        id: 10,
        name: 'Keychron K8 Keyboard',
        description: 'Wireless mechanical keyboard for developers.',
        image_url: 'https://picsum.photos/seed/keychronk8/640/480',
        price: 8499,
    },
    {
        id: 11,
        name: 'Amazon Echo Dot 5',
        description: 'Smart speaker with Alexa voice assistant.',
        image_url: 'https://picsum.photos/seed/echodot5/640/480',
        price: 5499,
    },
    {
        id: 12,
        name: 'Google Nest Hub',
        description: 'Smart display for home automation.',
        image_url: 'https://picsum.photos/seed/nesthub/640/480',
        price: 8999,
    },
    {
        id: 13,
        name: 'Canon EOS R50',
        description: 'Mirrorless camera for creators and vloggers.',
        image_url: 'https://picsum.photos/seed/canoneosr50/640/480',
        price: 74999,
    },
    {
        id: 14,
        name: 'GoPro HERO12',
        description: 'Action camera with 5.3K video recording.',
        image_url: 'https://picsum.photos/seed/gopro12/640/480',
        price: 44999,
    },
    {
        id: 15,
        name: 'PlayStation 5',
        description: 'Next-gen gaming console from Sony.',
        image_url: 'https://picsum.photos/seed/ps5/640/480',
        price: 54999,
    },
    {
        id: 16,
        name: 'Xbox Series X',
        description: 'Powerful gaming console from Microsoft.',
        image_url: 'https://picsum.photos/seed/xboxseriesx/640/480',
        price: 52999,
    },
    {
        id: 17,
        name: 'Nintendo Switch OLED',
        description: 'Portable gaming console with OLED screen.',
        image_url: 'https://picsum.photos/seed/switcholed/640/480',
        price: 32999,
    },
    {
        id: 18,
        name: 'JBL Flip 6',
        description: 'Portable waterproof Bluetooth speaker.',
        image_url: 'https://picsum.photos/seed/jblflip6/640/480',
        price: 11999,
    },
    {
        id: 19,
        name: 'Dyson V15 Detect',
        description: 'Cordless vacuum cleaner with laser detection.',
        image_url: 'https://picsum.photos/seed/dysonv15/640/480',
        price: 64999,
    },
    {
        id: 20,
        name: 'Mi Smart Band 8',
        description: 'Affordable fitness tracking smart band.',
        image_url: 'https://picsum.photos/seed/miband8/640/480',
        price: 3999,
    },
    {
        id: 21,
        name: 'Apple Watch Series 9',
        description: 'Advanced smartwatch with health tracking.',
        image_url: 'https://picsum.photos/seed/applewatch9/640/480',
        price: 45999,
    },
    {
        id: 22,
        name: 'Samsung Galaxy Watch 6',
        description: 'Wear OS smartwatch with fitness features.',
        image_url: 'https://picsum.photos/seed/galaxywatch6/640/480',
        price: 32999,
    },
    {
        id: 23,
        name: 'Asus ROG Strix G16',
        description: 'Gaming laptop with RTX graphics.',
        image_url: 'https://picsum.photos/seed/rogstrixg16/640/480',
        price: 189999,
    },
    {
        id: 24,
        name: 'HP Pavilion 15',
        description: 'Reliable everyday performance laptop.',
        image_url: 'https://picsum.photos/seed/hppavilion15/640/480',
        price: 69999,
    },
    {
        id: 25,
        name: 'Lenovo ThinkPad X1 Carbon',
        description: 'Business ultrabook with premium build quality.',
        image_url: 'https://picsum.photos/seed/thinkpadx1/640/480',
        price: 164999,
    },
    {
        id: 26,
        name: 'OnePlus 12',
        description: 'Flagship Android smartphone with fast charging.',
        image_url: 'https://picsum.photos/seed/oneplus12/640/480',
        price: 69999,
    },
    {
        id: 27,
        name: 'Nothing Phone 2',
        description: 'Stylish smartphone with Glyph interface.',
        image_url: 'https://picsum.photos/seed/nothingphone2/640/480',
        price: 44999,
    },
    {
        id: 28,
        name: 'Realme GT 6',
        description: 'Performance-focused smartphone with AMOLED display.',
        image_url: 'https://picsum.photos/seed/realmegt6/640/480',
        price: 38999,
    },
    {
        id: 29,
        name: 'Boat Airdopes 141',
        description: 'Budget wireless earbuds with long battery life.',
        image_url: 'https://picsum.photos/seed/airdopes141/640/480',
        price: 1499,
    },
    {
        id: 30,
        name: 'Anker Power Bank 20000mAh',
        description: 'Fast charging portable power bank.',
        image_url: 'https://picsum.photos/seed/ankerpb/640/480',
        price: 4999,
    },
    {
        id: 31,
        name: 'TP-Link Archer C6',
        description: 'Dual-band WiFi router for home use.',
        image_url: 'https://picsum.photos/seed/archerc6/640/480',
        price: 2999,
    },
    {
        id: 32,
        name: 'LG OLED C3 TV',
        description: 'Premium OLED smart television with Dolby Vision.',
        image_url: 'https://picsum.photos/seed/lgoledc3/640/480',
        price: 149999,
    },
    {
        id: 33,
        name: 'Samsung 55 Crystal 4K TV',
        description: '4K UHD smart TV with vibrant colors.',
        image_url: 'https://picsum.photos/seed/samsung4ktv/640/480',
        price: 65999,
    },
    {
        id: 34,
        name: 'Kindle Paperwhite',
        description: 'E-reader with glare-free display.',
        image_url: 'https://picsum.photos/seed/kindlepaperwhite/640/480',
        price: 13999,
    },
    {
        id: 35,
        name: 'Nike Air Max 270',
        description: 'Comfortable lifestyle sneakers from Nike.',
        image_url: 'https://picsum.photos/seed/airmax270/640/480',
        price: 12999,
    },
    {
        id: 36,
        name: 'Adidas Ultraboost 22',
        description: 'Running shoes with responsive cushioning.',
        image_url: 'https://picsum.photos/seed/ultraboost22/640/480',
        price: 14999,
    },
    {
        id: 37,
        name: 'Puma Sports Backpack',
        description: 'Durable backpack for daily and gym use.',
        image_url: 'https://picsum.photos/seed/pumabag/640/480',
        price: 2499,
    },
    {
        id: 38,
        name: 'Wildcraft Hiking Bag',
        description: 'Large hiking backpack with rain cover.',
        image_url: 'https://picsum.photos/seed/wildcraftbag/640/480',
        price: 4999,
    },
    {
        id: 39,
        name: 'Casio G-Shock GA2100',
        description: 'Shock-resistant analog digital watch.',
        image_url: 'https://picsum.photos/seed/gshockga2100/640/480',
        price: 8999,
    },
    {
        id: 40,
        name: 'Fossil Gen 6 Smartwatch',
        description: 'Stylish smartwatch powered by Wear OS.',
        image_url: 'https://picsum.photos/seed/fossilgen6/640/480',
        price: 22999,
    }, {
        id: 41,
        name: 'Acer Nitro 5',
        description: 'Gaming laptop with high refresh rate display.',
        image_url: 'https://picsum.photos/seed/acernitro5/640/480',
        price: 94999,
    },
    {
        id: 42,
        name: 'MSI Katana GF66',
        description: 'Performance gaming laptop with RTX graphics.',
        image_url: 'https://picsum.photos/seed/msigf66/640/480',
        price: 114999,
    },
    {
        id: 43,
        name: 'Razer DeathAdder V3',
        description: 'Ergonomic gaming mouse with optical switches.',
        image_url: 'https://picsum.photos/seed/deathadderv3/640/480',
        price: 6999,
    },
    {
        id: 44,
        name: 'SteelSeries Arctis 7',
        description: 'Wireless gaming headset with surround sound.',
        image_url: 'https://picsum.photos/seed/arctis7/640/480',
        price: 15999,
    },
    {
        id: 45,
        name: 'Corsair K95 RGB',
        description: 'Mechanical gaming keyboard with RGB lighting.',
        image_url: 'https://picsum.photos/seed/corsairk95/640/480',
        price: 17999,
    },
    {
        id: 46,
        name: 'BenQ MOBIUZ EX2710',
        description: '27-inch gaming monitor with 144Hz refresh rate.',
        image_url: 'https://picsum.photos/seed/benqmobiuz/640/480',
        price: 28999,
    },
    {
        id: 47,
        name: 'LG UltraGear 32GN650',
        description: 'QHD gaming monitor with HDR support.',
        image_url: 'https://picsum.photos/seed/lgultragear/640/480',
        price: 34999,
    },
    {
        id: 48,
        name: 'SanDisk Extreme SSD 1TB',
        description: 'Portable high-speed external solid state drive.',
        image_url: 'https://picsum.photos/seed/sandiskssd/640/480',
        price: 10999,
    },
    {
        id: 49,
        name: 'WD My Passport 2TB',
        description: 'Portable external hard drive for backups.',
        image_url: 'https://picsum.photos/seed/wdpassport/640/480',
        price: 6999,
    },
    {
        id: 50,
        name: 'Seagate BarraCuda 4TB',
        description: 'Internal hard drive for desktop storage.',
        image_url: 'https://picsum.photos/seed/barracuda4tb/640/480',
        price: 8499,
    },
    {
        id: 51,
        name: 'Philips Hue Starter Kit',
        description: 'Smart lighting kit with app control.',
        image_url: 'https://picsum.photos/seed/philipshue/640/480',
        price: 12999,
    },
    {
        id: 52,
        name: 'Mi Robot Vacuum Mop',
        description: 'Smart robotic vacuum cleaner with mop feature.',
        image_url: 'https://picsum.photos/seed/mirobotvacuum/640/480',
        price: 21999,
    },
    {
        id: 53,
        name: 'Instant Pot Duo 7L',
        description: 'Multi-use electric pressure cooker.',
        image_url: 'https://picsum.photos/seed/instantpotduo/640/480',
        price: 9999,
    },
    {
        id: 54,
        name: 'NutriBullet Pro',
        description: 'High-speed personal blender for smoothies.',
        image_url: 'https://picsum.photos/seed/nutribullet/640/480',
        price: 6499,
    },
    {
        id: 55,
        name: 'Prestige Induction Cooktop',
        description: 'Energy efficient induction stove.',
        image_url: 'https://picsum.photos/seed/prestigeinduction/640/480',
        price: 3499,
    },
    {
        id: 56,
        name: 'KitchenAid Stand Mixer',
        description: 'Premium mixer for baking and cooking.',
        image_url: 'https://picsum.photos/seed/kitchenaidmixer/640/480',
        price: 45999,
    },
    {
        id: 57,
        name: 'Borosil Coffee Maker',
        description: 'Automatic drip coffee machine.',
        image_url: 'https://picsum.photos/seed/borosilcoffee/640/480',
        price: 4999,
    },
    {
        id: 58,
        name: 'Milton Thermosteel Bottle',
        description: 'Vacuum insulated stainless steel water bottle.',
        image_url: 'https://picsum.photos/seed/miltonbottle/640/480',
        price: 899,
    },
    {
        id: 59,
        name: 'Titan Neo Analog Watch',
        description: 'Elegant analog wrist watch for men.',
        image_url: 'https://picsum.photos/seed/titanneo/640/480',
        price: 5499,
    },
    {
        id: 60,
        name: 'Ray-Ban Aviator Classic',
        description: 'Iconic aviator sunglasses with UV protection.',
        image_url: 'https://picsum.photos/seed/raybanaviator/640/480',
        price: 8999,
    },
    {
        id: 61,
        name: 'American Tourister Trolley Bag',
        description: 'Durable travel suitcase with spinner wheels.',
        image_url: 'https://picsum.photos/seed/trolleybag/640/480',
        price: 7499,
    },
    {
        id: 62,
        name: 'Safari Laptop Backpack',
        description: 'Spacious backpack with laptop compartment.',
        image_url: 'https://picsum.photos/seed/safaribag/640/480',
        price: 1999,
    },
    {
        id: 63,
        name: 'Nike Dri-FIT T-Shirt',
        description: 'Breathable sports t-shirt for workouts.',
        image_url: 'https://picsum.photos/seed/nikedrifit/640/480',
        price: 2499,
    },
    {
        id: 64,
        name: 'Adidas Track Pants',
        description: 'Comfortable athletic wear for training.',
        image_url: 'https://picsum.photos/seed/adidastrackpants/640/480',
        price: 3299,
    },
    {
        id: 65,
        name: 'Under Armour Gym Gloves',
        description: 'Training gloves with enhanced grip.',
        image_url: 'https://picsum.photos/seed/uagloves/640/480',
        price: 1499,
    },
    {
        id: 66,
        name: 'Decathlon Yoga Mat',
        description: 'Non-slip yoga mat for fitness and exercise.',
        image_url: 'https://picsum.photos/seed/yogamat/640/480',
        price: 1199,
    },
    {
        id: 67,
        name: 'Cosco Football',
        description: 'Durable football suitable for outdoor play.',
        image_url: 'https://picsum.photos/seed/coscofootball/640/480',
        price: 799,
    },
    {
        id: 68,
        name: 'Yonex Badminton Racket',
        description: 'Lightweight racket for intermediate players.',
        image_url: 'https://picsum.photos/seed/yonexracket/640/480',
        price: 2999,
    },
    {
        id: 69,
        name: 'Kindle Scribe',
        description: 'E-reader with note-taking capabilities.',
        image_url: 'https://picsum.photos/seed/kindlescribe/640/480',
        price: 32999,
    },
    {
        id: 70,
        name: 'Samsung T7 Portable SSD',
        description: 'Compact external SSD with USB-C connectivity.',
        image_url: 'https://picsum.photos/seed/samsungt7/640/480',
        price: 11999,
    },
    {
        id: 71,
        name: 'Asus ZenBook 14',
        description: 'Slim ultrabook with OLED display.',
        image_url: 'https://picsum.photos/seed/zenbook14/640/480',
        price: 104999,
    },
    {
        id: 72,
        name: 'Huawei MatePad 11',
        description: 'Productivity-focused Android tablet.',
        image_url: 'https://picsum.photos/seed/matepad11/640/480',
        price: 42999,
    },
    {
        id: 73,
        name: 'Redmi Note 13 Pro',
        description: 'Mid-range smartphone with high refresh display.',
        image_url: 'https://picsum.photos/seed/redminote13pro/640/480',
        price: 27999,
    },
    {
        id: 74,
        name: 'Vivo X100',
        description: 'Camera-centric flagship smartphone.',
        image_url: 'https://picsum.photos/seed/vivox100/640/480',
        price: 63999,
    },
    {
        id: 75,
        name: 'Oppo Enco Air 3',
        description: 'True wireless earbuds with deep bass.',
        image_url: 'https://picsum.photos/seed/oppoencoair3/640/480',
        price: 3999,
    },
    {
        id: 76,
        name: 'Marshall Emberton Speaker',
        description: 'Portable Bluetooth speaker with rich sound.',
        image_url: 'https://picsum.photos/seed/marshallemberton/640/480',
        price: 14999,
    },
    {
        id: 77,
        name: 'Fire-Boltt Ninja Call Pro',
        description: 'Affordable smartwatch with Bluetooth calling.',
        image_url: 'https://picsum.photos/seed/fireboltt/640/480',
        price: 1999,
    },
    {
        id: 78,
        name: 'Usha Room Heater',
        description: 'Compact room heater for winter comfort.',
        image_url: 'https://picsum.photos/seed/ushheater/640/480',
        price: 2499,
    },
    {
        id: 79,
        name: 'Voltas 1.5 Ton Inverter AC',
        description: 'Energy efficient split air conditioner.',
        image_url: 'https://picsum.photos/seed/voltasac/640/480',
        price: 42999,
    },
    {
        id: 80,
        name: 'IFB Front Load Washing Machine',
        description: 'Fully automatic washing machine with steam wash.',
        image_url: 'https://picsum.photos/seed/ifbwashing/640/480',
        price: 38999,
    },
];

async function create() {
    cartDataSource.setOptions({
        ...options,
    });

    await cartDataSource.initialize();

    const queryRunner = cartDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // use same hardcoded products across all services
        const createdProducts = await queryRunner.manager.save(
            ProductEntity,
            products,
        );

        console.log(createdProducts);

        /*
        // faker random products (keep for future use if needed)
        const products: Partial<ProductEntity>[] = [];

        for (let i = 0; i < 50; i++) {
            const category = faker.commerce.product();

            products.push({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                image_url: faker.image.urlLoremFlickr({
                    category,
                    width: 640,
                    height: 480,
                }),
                price: Number(
                    faker.commerce.price({
                        min: 100,
                        max: 10000,
                        dec: 2,
                    }),
                ),
            });
        }

        await queryRunner.manager.save(ProductEntity, products);
        */

        await queryRunner.commitTransaction();

        console.info('✅ Products seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
        await cartDataSource.destroy();
    }
}

void create();