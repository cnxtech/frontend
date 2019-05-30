import IconSet from '@emcasa/ui/lib/styles/createIconSet'

export default IconSet({
  filter: {
    width: 21,
    height: 16.5,
    render: ({color, ...props}) => (
      <g fill="none" fillRule="evenodd">
        <path d="M-2-4h24v24H-2z" />
        <path
          strokeLinecap="round"
          strokeWidth="2"
          {...props}
          stroke={color}
          d="M19.5 3.5H6h13.5zm-4.5 9H1.10546875 15zM3.5 6C2.11928813 6 1 4.88071187 1 3.5S2.11928813 1 3.5 1 6 2.11928813 6 3.5 4.88071187 6 3.5 6zm14 9c-1.3807119 0-2.5-1.1192881-2.5-2.5s1.1192881-2.5 2.5-2.5 2.5 1.1192881 2.5 2.5-1.1192881 2.5-2.5 2.5z"
        />
      </g>
    )
  }
})
