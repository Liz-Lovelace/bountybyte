import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateEditForm, setEditForm, updateProfileThunk, fetchUserThunk } from '../../store/usersSlice';
import { refreshAuth } from '../../store/authSlice';
import { navigateTo } from '../../store/routerSlice';
import TechStackInputSection from '../form-primitives/TechStackInputSection';

export default function EditMyProfile() {
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.auth);
  const { editForm, isUpdating, editFormValidation } = useSelector(state => state.users);

  // On mount, set form to current user's info
  useEffect(() => {
    if (me.id) {
      dispatch(setEditForm({
        bio: me.bio,
        techStack: me.tech_stack
      }));
    }
  }, [me, dispatch]);

  const handleChange = (e) => {
    dispatch(updateEditForm({
      field: e.target.name,
      value: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfileThunk({
      bio: editForm.bio,
      techStack: editForm.techStack
    }));
    // If update was successful, redirect to profile page
    if (result?.responseType === 'happyPathResponse' && me?.id) {
      dispatch(refreshAuth());
      dispatch(navigateTo(`/user/${me.id}`));
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{me.username}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block font-semibold mb-1" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={editForm.bio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            maxLength={3000}
          />
          {editFormValidation.fields.bio?.map(({messageType, text}, i) => (
            <div key={i} className="text-red-500 text-sm">{text}</div>
          ))}
        </div>
        <div className="mb-16">
          <label className="block font-semibold mb-1" htmlFor="techStack">Tech Stack</label>
          <TechStackInputSection 
            techIds={editForm.techStack}
            updateTechIds={(val) => handleChange({ target: { name: 'techStack', value: val } })}
          />
          {editFormValidation.fields.techStack?.map(({messageType, text}, i) => (
            <div key={i} className="text-red-500 text-sm">{text}</div>
          ))}
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
} 