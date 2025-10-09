import React, { useEffect, useState } from 'react';
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from "moment";
import CreateSessionForm from './CreateSessionForm';
import DeleteAlertContent from '../../components/DeleteAlertContent';
import Modal from '../../components/Loader/Modal';
import SummaryCard from '../../components/Cards/SummaryCard';

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ open: false, data: null });

  // Fetch all sessions
  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data || []);
    } catch (error) {
      console.error("Error fetching session data:", error);
      toast.error("Failed to fetch sessions");
    }
  };

  // Delete session
  const deleteSession = async (sessionData) => {
    if (!sessionData?._id) return;
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData._id));
      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({ open: false, data: null });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session data:", error);
      toast.error("Failed to delete session");
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className='container mx-auto pt-4 pb-4'>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-[70vh] space-y-3 
                          bg-orange-50/70 rounded-2xl mx-4 md:mx-0 shadow-inner border border-orange-100">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
              START YOUR INTERVIEW PREPARATION
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              CLICK ON THE <span className="font-bold text-orange-500">ADD NEW</span> BUTTON BELOW
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0'>
            {sessions.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length].bgcolor}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || "-"}
                questions={data?.questions?.length || "-"}
                description={data?.description || ""}
                lastUpdated={
                  data?.updatedAt ? moment(data.updatedAt).format("Do MMM YYYY") : ""
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))}
          </div>
        )}

        <button
          className='h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20'
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className='text-2xl text-white' />
          Add New
        </button>
      </div>

      {/* Create Session Modal */}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <CreateSessionForm />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={openDeleteAlert.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Alert"
      >
        <div className='w-[30vw]'>
          <DeleteAlertContent
            content="Are you sure you want to delete this session detail?"
            onDelete={() => deleteSession(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
