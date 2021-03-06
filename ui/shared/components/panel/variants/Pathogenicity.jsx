import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Label, Icon } from 'semantic-ui-react'

import { CLINSIG_SEVERITY } from '../../../utils/constants'
import { snakecaseToTitlecase } from '../../../utils/stringUtils'
import { HorizontalSpacer } from '../../Spacers'


const StarsContainer = styled.span`
  margin-left: 10px;
`

const StarIcon = styled(Icon).attrs({ name: 'star' })`
  color: ${props => (props.goldstar ? '#FFB70A' : '#D5D5D5')};
  margin: 0em 0.2em 0em 0em !important;
`

const CLINSIG_COLOR = {
  1: 'red',
  0: 'orange',
  [-1]: 'green',
}

const HGMD_CLASS_NAMES = {
  DM: 'Disease Causing (DM)',
  'DM?': 'Disease Causing? (DM?)',
  FPV: 'Frameshift or truncating variant (FTV)',
  FP: 'In vitro/laboratory or in vivo functional polymorphism (FP)',
  DFP: 'Disease-associated polymorphism with additional supporting functional evidence (DFP)',
  DP: 'Disease-associated polymorphism (DP)',
}
const hgmdName = hgmdClass => HGMD_CLASS_NAMES[hgmdClass]

const ClinvarStars = ({ goldStars }) => goldStars != null &&
  <StarsContainer>
    {Array.from(Array(4).keys()).map(i => (i < goldStars ? <StarIcon key={i} goldstar="yes" /> : <StarIcon key={i} />))}
  </StarsContainer>

ClinvarStars.propTypes = {
  goldStars: PropTypes.number,
}


const PathogenicityLabel = ({ clinsig, formatName, goldStars }) =>
  <Label color={CLINSIG_COLOR[CLINSIG_SEVERITY[clinsig.toLowerCase()]] || 'grey'} size="medium" horizontal basic>
    {formatName ? formatName(clinsig) : clinsig}
    <ClinvarStars goldStars={goldStars} />
  </Label>

PathogenicityLabel.propTypes = {
  clinsig: PropTypes.string.isRequired,
  formatName: PropTypes.func,
  goldStars: PropTypes.number,
}

const PathogenicityLink = ({ href, ...labelProps }) =>
  <a href={href} target="_blank">
    <PathogenicityLabel {...labelProps} />
    <HorizontalSpacer width={5} />
  </a>

PathogenicityLink.propTypes = {
  href: PropTypes.string.isRequired,
}


const clinvarUrl = (clinvar) => {
  const baseUrl = 'http://www.ncbi.nlm.nih.gov/clinvar'
  const variantPath = clinvar.alleleId ? `?term=${clinvar.alleleId}[alleleid]` : `/variation/${clinvar.variantId}`
  return baseUrl + variantPath
}

const Pathogenicity = ({ variant }) => {
  if (!variant.clinvar.variantId && !variant.clinvar.alleleId && !variant.hgmd.class) {
    return null
  }

  return (
    <span>
      {variant.clinvar.clinsig &&
        <span>
          <b>ClinVar:<HorizontalSpacer width={5} /></b>
          <PathogenicityLink
            key={variant.clinvar.clinsig}
            clinsig={variant.clinvar.clinsig}
            href={clinvarUrl(variant.clinvar)}
            formatName={snakecaseToTitlecase}
            goldStars={variant.clinvar.goldStars}
          />
        </span>
      }
      {variant.hgmd.class &&
        <span>
          <HorizontalSpacer width={5} />
          <b>HGMD:<HorizontalSpacer width={5} /></b>
          <PathogenicityLink
            clinsig={variant.hgmd.class}
            href={`https://portal.biobase-international.com/hgmd/pro/mut.php?acc=${variant.hgmd.accession}`}
            formatName={hgmdName}
          />
        </span>
      }
    </span>
  )
}

Pathogenicity.propTypes = {
  variant: PropTypes.object,
}


export default Pathogenicity
