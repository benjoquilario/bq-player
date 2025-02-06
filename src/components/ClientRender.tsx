import React from "react"

const ClientRender: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [rendered, setRendered] = React.useState(typeof window !== "undefined")

  React.useEffect(() => {
    setRendered(true)
  }, [])

  if (rendered) return children

  return <React.Fragment></React.Fragment>
}

export default ClientRender
