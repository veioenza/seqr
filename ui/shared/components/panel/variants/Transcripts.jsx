import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Label, Header, Table, Segment } from 'semantic-ui-react'

import { getGenesById } from 'redux/selectors'
import { VerticalSpacer } from '../../Spacers'
import ShowGeneModal from '../../buttons/ShowGeneModal'
import { ProteinSequence } from './Annotations'
import { GENOME_VERSION_37 } from '../../../utils/constants'


const TranscriptLink = styled.a`
  font-size: 1.3em;
  font-weight: ${(props) => { return props.isChosen ? 'bold' : 'normal' }}
`

const AnnotationSection = styled.div`
  display: inline-block;
  padding-right: 30px;
`

const AnnotationLabel = styled.small`
  font-weight: bolder;
  color: grey;
  padding-right: 10px;
`

const Transcripts = ({ variant, genesById }) =>
  variant.transcripts && Object.entries(variant.transcripts).map(([geneId, geneTranscripts]) =>
    <div key={geneId}>
      <Header
        size="huge"
        attached="top"
        content={genesById[geneId] && <ShowGeneModal gene={genesById[geneId]} modalId={`${variant.variantId}-transcripts`} />}
        subheader={`Gene Id: ${geneId}`}
      />
      <Segment attached="bottom">
        <Table basic="very">
          <Table.Body>
            {geneTranscripts.map(transcript =>
              <Table.Row key={transcript.transcriptId}>
                <Table.Cell width={3}>
                  <TranscriptLink
                    target="_blank"
                    href={`http://${variant.genomeVersion === GENOME_VERSION_37 ? 'grch37' : 'useast'}.ensembl.org/Homo_sapiens/Transcript/Summary?t=${transcript.transcriptId}`}
                    isChosen={transcript.isChosenTranscript}
                  >
                    {transcript.transcriptId}
                  </TranscriptLink>
                  <div>
                    {transcript.isChosenTranscript &&
                      <span>
                        <VerticalSpacer height={5} />
                        <Label content="Chosen Transcript" color="orange" size="small" />
                      </span>
                    }
                    {transcript.canonical &&
                      <span>
                        <VerticalSpacer height={5} />
                        <Label content="Canonical Transcript" color="green" size="small" />
                      </span>
                    }
                  </div>
                </Table.Cell>
                <Table.Cell width={4}>
                  {transcript.consequence}
                </Table.Cell>
                <Table.Cell width={9}>
                  <AnnotationSection>
                    <AnnotationLabel>Codons</AnnotationLabel>{transcript.codons}<br />
                    <AnnotationLabel>Amino Acids</AnnotationLabel>{transcript.aminoAcids}<br />
                  </AnnotationSection>
                  <AnnotationSection>
                    <AnnotationLabel>cDNA Position</AnnotationLabel>{transcript.cdnaPosition}<br />
                    <AnnotationLabel>CDS Position</AnnotationLabel>{transcript.cdsPosition}<br />
                  </AnnotationSection>
                  <AnnotationSection>
                    <AnnotationLabel>HGVS.C</AnnotationLabel>{transcript.hgvsc && <ProteinSequence hgvs={transcript.hgvsc} />}<br />
                    <AnnotationLabel>HGVS.P</AnnotationLabel>{transcript.hgvsp && <ProteinSequence hgvs={transcript.hgvsp} />}<br />
                  </AnnotationSection>
                </Table.Cell>
              </Table.Row>,
            )}
          </Table.Body>
        </Table>
      </Segment>
      <VerticalSpacer height={10} />
    </div>,
  )

Transcripts.propTypes = {
  variant: PropTypes.object.isRequired,
  genesById: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  genesById: getGenesById(state),
})

export default connect(mapStateToProps)(Transcripts)

