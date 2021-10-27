import Header from './Header'

type Props = {
	children: React.ReactNode
}

const MainTemplate = (props:Props) => {
	return (
		<>
		<Header/>
		{props.children}
		</>
	)
}

export default MainTemplate