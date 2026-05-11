import React from 'react'
import { Box, Text } from 'ink'

export type NavItem = {
  key: string
  label: string
}

type Props = {
  items: NavItem[]
  status?: string
  statusColor?: string
}

export const NavBar = ({ items, status, statusColor = 'yellow' }: Props) => (
  <Box
    borderStyle="round"
    borderColor="gray"
    paddingLeft={1}
    paddingRight={1}
    marginTop={1}
  >
    <Text color="gray" dimColor>
      {items.map((item, i) => (
        <React.Fragment key={item.key}>
          {i > 0 && '  '}
          <Text color="green" bold>{item.key}</Text>
          {' '}{item.label}
        </React.Fragment>
      ))}
      {status && (
        <Text color={statusColor as any}> · {status}</Text>
      )}
    </Text>
  </Box>
)
