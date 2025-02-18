import { useState, useCallback } from 'react';
import ownerService from '../services/ownerService';

export const useEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employees
    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            const data = await ownerService.getEmployees();
            setEmployees(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Add employee
    const addEmployee = async (employeeData) => {
        try {
            setLoading(true);
            const newEmployee = await ownerService.addEmployee(employeeData);
            setEmployees(prev => [...prev, newEmployee]);
            return newEmployee;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update employee
    const updateEmployee = async (id, employeeData) => {
        try {
            setLoading(true);
            const updatedEmployee = await ownerService.updateEmployee(id, employeeData);
            setEmployees(prev => 
                prev.map(emp => emp.id === id ? updatedEmployee : emp)
            );
            return updatedEmployee;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete employee
    const deleteEmployee = async (id) => {
        try {
            setLoading(true);
            await ownerService.deleteEmployee(id);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        employees,
        loading,
        error,
        fetchEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee
    };
}; 