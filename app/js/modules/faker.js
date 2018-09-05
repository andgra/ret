import Faker from 'faker/lib';
import ru from 'faker/lib/locales/ru';
import en from 'faker/lib/locales/en';

let faker = new Faker({ locales: {ru, en} });
faker.locale = "ru";

export default faker;