import { cp, mkdir, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getCitiesOfState, getCountries, getStatesOfCountry } from '@countrystatecity/countries'

const LOCATION_DATA_VERSION = 'v1'
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const locationsRoot = path.join(projectRoot, 'public', 'locations')
const targetDirectory = path.join(locationsRoot, LOCATION_DATA_VERSION)
const temporaryDirectory = path.join(locationsRoot, `.${LOCATION_DATA_VERSION}-tmp`)
const citiesDirectory = path.join(temporaryDirectory, 'cities')

const compareLocations = (left, right) => {
  const nameComparison = left.name.localeCompare(right.name, 'en')

  return nameComparison || (left.region ?? '').localeCompare(right.region ?? '', 'en')
}

const writeJson = (filePath, value) => writeFile(filePath, `${JSON.stringify(value)}\n`, 'utf8')

const generateLocations = async () => {
  await rm(temporaryDirectory, { force: true, recursive: true })
  await mkdir(citiesDirectory, { recursive: true })

  const sourceCountries = await getCountries()
  const countries = sourceCountries
    .map(({ iso2, name }) => ({ code: iso2, name }))
    .sort(compareLocations)

  await writeJson(path.join(temporaryDirectory, 'countries.json'), countries)

  let cityCount = 0

  for (const country of countries) {
    const regions = await getStatesOfCountry(country.code)
    const cityGroups = await Promise.all(
      regions.map(async (region) => {
        const cities = await getCitiesOfState(country.code, region.iso2)

        return cities.map((city) => ({
          id: String(city.id),
          name: city.name,
          region: region.name,
        }))
      })
    )
    const cities = cityGroups.flat().sort(compareLocations)

    cityCount += cities.length
    await writeJson(path.join(citiesDirectory, `${country.code}.json`), cities)
  }

  await rm(targetDirectory, { force: true, recursive: true })

  try {
    await rename(temporaryDirectory, targetDirectory)
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'EPERM') {
      throw error
    }

    await cp(temporaryDirectory, targetDirectory, { recursive: true })
    await rm(temporaryDirectory, { force: true, recursive: true })
  }

  console.log(`Generated ${countries.length} countries and ${cityCount} cities.`)
}

await generateLocations()
