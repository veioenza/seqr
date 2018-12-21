import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Header } from 'semantic-ui-react'

import { getFamiliesByGuid, getIndividualsByGuid } from 'redux/selectors'
import { Select } from 'shared/components/form/Inputs'
import PedigreeIcon from 'shared/components/icons/PedigreeIcon'
import PedigreeImagePanel from 'shared/components/panel/view-pedigree-image/PedigreeImagePanel'
import { AFFECTED, UNAFFECTED, AFFECTED_OPTIONS } from 'shared/utils/constants'
import { NUM_ALT_OPTIONS } from '../../constants'
import { getSearchedProjectsFamiliesInput } from '../../selectors'


const CUSTOM_FILTERS = [
  { filterField: 'affected', options: AFFECTED_OPTIONS },
  { filterField: 'genotype', options: NUM_ALT_OPTIONS, placeholder: 'Allele count' },
]

const CustomInheritanceFilter = ({ value, onChange, searchedProjectFamilies, familiesByGuid, individualsByGuid }) => {
  if (searchedProjectFamilies.length !== 1 || searchedProjectFamilies[0].familyGuids.length !== 1) {
    return <Header disabled content="Custom inheritance search is disabled for multi-family searches" />
  }

  const family = familiesByGuid[searchedProjectFamilies[0].familyGuids[0]]
  const individuals = family.individualGuids.map(individualGuid => individualsByGuid[individualGuid])

  const parentGenotypes = {}
  if (value.mother || value.father) {
    individuals.forEach((individual) => {
      if (individual.affected === AFFECTED) {
        parentGenotypes[individual.maternalId] = value.mother
        parentGenotypes[individual.paternalId] = value.father
      }
    })
  }

  const individualFilters = individuals.reduce((acc, ind) => {
    const affected = (value.affected || {})[ind.individualGuid] || ind.affected
    let genotype = (value.genotype || {})[ind.individualGuid]
    if (!genotype) {
      if (affected === UNAFFECTED && parentGenotypes[ind.individualId]) {
        genotype = parentGenotypes[ind.individualId]
      } else {
        genotype = value[affected]
      }
    }
    return { ...acc, [ind.individualGuid]: { affected, genotype } }
  }, {})

  const handleChange = (individual, filterField) => (val) => {
    onChange({ ...value, [filterField]: { ...value[filterField], [individual.individualGuid]: val } })
  }

  return (
    <Table basic="very" compact>
      <Table.Body>
        {individuals.map((individual, i) =>
          <Table.Row key={individual.individualGuid}>
            <Table.Cell collapsing key={`${individual.individualGuid}-pedigree`}>
              <PedigreeIcon sex={individual.sex} affected={individual.affected} />
              &nbsp;
              {individual.displayName || individual.individualId}
              {individual.displayName && individual.displayName !== individual.individualId ? `(${individual.individualId})` : null}
            </Table.Cell>
            {CUSTOM_FILTERS.map(({ filterField, ...fieldProps }) => (
              <Table.Cell key={filterField}>
                <Select
                  {...fieldProps}
                  value={individualFilters[individual.individualGuid][filterField]}
                  onChange={handleChange(individual, filterField)}
                />
              </Table.Cell>
            ))}
            {i === 0 ?
              <Table.Cell collapsing rowSpan={individuals.length}>
                <PedigreeImagePanel key="pedigree" family={family} />
              </Table.Cell> : <Table.Cell collapsing />
            }
          </Table.Row>,
      )}
      </Table.Body>
    </Table>
  )
}


const mapStateToProps = state => ({
  searchedProjectFamilies: getSearchedProjectsFamiliesInput(state),
  familiesByGuid: getFamiliesByGuid(state),
  individualsByGuid: getIndividualsByGuid(state),
})

CustomInheritanceFilter.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  searchedProjectFamilies: PropTypes.array,
  familiesByGuid: PropTypes.object,
  individualsByGuid: PropTypes.object,
}

export default connect(mapStateToProps)(CustomInheritanceFilter)