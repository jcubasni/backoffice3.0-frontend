import { TD, TH, TR } from "@ag-media/react-pdf-table"
import { Text, View } from "@react-pdf/renderer"
import { styles } from "../styles/daily-report/table"

type ThProps = React.ComponentProps<typeof TH>
type TdProps = React.ComponentProps<typeof TD>
type TrProps = React.ComponentProps<typeof TR>

export const THeader = ({ children, style, ...props }: ThProps) => {
  return (
    <TH style={{ ...styles.tableHeader, ...style }} {...props}>
      {children}
    </TH>
  )
}

export const THead = ({ children, style, ...props }: TdProps) => {
  return (
    <TD style={{ ...styles.headerCell, ...style }} {...props}>
      {children}
    </TD>
  )
}

export const TCell = ({ children, style, ...props }: TdProps) => {
  return (
    <TD style={{ ...styles.contentCell, ...style }} {...props}>
      {children}
    </TD>
  )
}

export const TFooter = ({ children, style, ...props }: TrProps) => {
  return (
    <TR style={{ ...styles.footerCell, ...style }} {...props}>
      {children}
    </TR>
  )
}

// Componente para headers de tabla con dos líneas de texto y gap
export const TableHeaderDoubleLine = ({
  firstLine,
  secondLine,
  style,
  ...props
}: {
  firstLine: string
  secondLine: string
  style?: any
  [key: string]: any
}) => (
  <TD style={{ ...styles.headerCell, ...style }} {...props}>
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Text>{firstLine}</Text>
      <Text>{secondLine}</Text>
    </View>
  </TD>
)
