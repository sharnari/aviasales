import { useDispatch, useSelector } from 'react-redux'

import { handleCheckboxChange } from '../../store/filterSlice'

import styles from './filter.module.scss'

interface CheckboxState {
  id: string
  text: string
  isCheck: boolean
}

const Filter: React.FC = () => {
  const dispatch = useDispatch()
  const checkboxes = useSelector((state: { store: { filter: CheckboxState[] } }) => state.store.filter)
  const onCheckboxChange = (id: string) => {
    dispatch(handleCheckboxChange(id))
  }

  const filterItemJSX = () => {
    return checkboxes.map((el: CheckboxState) => {
      return (
        <li key={el.id} className={styles.filterListItem}>
          <input
            className={styles.inputCheckbox}
            id={el.id}
            type="checkbox"
            checked={el.isCheck}
            onChange={() => onCheckboxChange(el.id)}
          />
          <label htmlFor={el.id}>{el.text}</label>
        </li>
      )
    })
  }

  return (
    <div className={styles.filter}>
      <h2 className={styles.filterName}>Количество пересадок</h2>
      <ul className={styles.filterList}>{filterItemJSX()}</ul>
    </div>
  )
}

export default Filter
