package org.gnu.glpk;

/**
 * Terminal Listener
 * <p>GLPK will call method {@link GlpkTerminal#callback(String)
 * GlpkTerminal.output} before producing terminal output. A listener can
 * inhibit the terminal output by returning <code>false</code> in the
 * {@link #output(String) output} routine.
 * <p>If a {@link GlpkException GlpkExeption} has occured it is necessary to
 * call<pre>
 * GLPK.glp_term_hook(null, null);</pre>
 * to reenable listening to terminal output.
 * @see GlpkTerminal
 * @see GlpkException
 * @see GLPK#glp_term_hook(SWIGTYPE_p_f_p_void_p_q_const__char__int,
 * SWIGTYPE_p_void)
 */
public interface GlpkTerminalListener {
    /**
     * Receive terminal output.
     * <p>The return value controls, if the mesage is displayed in the
     * console.
     * @param str output string
     * @return true if terminal output is requested
     */
    boolean output(String str);
}
